const e=[{slug:"system-one-decisions-for-robots",title:"Beyond if/else: A First Step Toward System One Decision Models for Robots",date:"2026-10-27",tags:["Go","Robotics","Machine Learning","System One","ONNX","Reinforcement Learning"],description:"I embedded Laya, an open-source System One decision model, in a Go robot runtime and pitted it against hand-written rules. Here's what worked, what didn't, and why RL on simple tasks plus a sub-2 GB GPU target is the path to something actually useful.",readTime:"10 min read",file:"system-one-decisions-for-robots.md",content:`
# Beyond if/else: A First Step Toward System One Decision Models for Robots

Most robots I've seen make their high-level decisions the same way: a stack of \`if\` statements that someone wrote at 2 a.m. after the last field incident.

\`\`\`python
if obstacle_ahead < 2:   stop()
elif person_within(8):   slow_down()
elif battery < 20:       return_to_dock()
else:                    drive()
\`\`\`

This works right up until the world does something your conditions didn't anticipate. A person *walking away* from the robot trips \`person_within(8)\` just like a child *running at* it. A cardboard box at the edge of the aisle trips \`obstacle_ahead < 2\` just like a wall. Every fix is another branch, and the branches start fighting each other.

The decisions a robot supervisor makes are rarely about one factor. They are about how several factors *combine*. So I wanted to try something different: let a small, fast model read the situation and return **probabilities** for a handful of typed questions, and keep the code in charge of what to do with them.

That's the idea behind **System One decision models**, and this post is about my first step toward using them in robotics.

## What is a "System One" model?

The name borrows from Kahneman: *System 1* is fast, intuitive judgment; *System 2* is slow, deliberate reasoning. LLMs are great System 2 engines, but they're slow, generate free-form text, and you have to parse their answers.

A System One decision model is different. You give it:

1. **A state**: text or JSON describing the situation.
2. **Typed questions**: a *choice* between named options, a *score* on an ordered scale, or a *yes/no*.

It returns a **calibrated probability distribution** for each question, computed in a single forward pass. It generates no text and needs no parsing, so it can't ramble.

The category was popularized in September 2026 by TypeSafe AI's **Jev**, a closed, API-only model. Within weeks, open alternatives appeared. The one I used is **[Laya](https://huggingface.co/convaiinnovations/laya-typed-decisions)** from ConvAI Innovations: a ModernBERT-large encoder with a small decision head, about 421M parameters, Apache-2.0 licensed. Each option gets its own \`[MASK]\` marker in the input, and the model scores every marker in parallel.

## What I built: goSysOne

**goSysOne** is a Go runtime that embeds Laya in-process through ONNX Runtime. No Python sidecar and no network hop: the robot's supervisor calls a Go interface and gets probabilities back.

\`\`\`go
var Questions = decision.Questions{
    "behavior": decision.NewChoice("Choose the safest behavior for the robot.",
        "continue_task", "slow_down", "stop_and_wait", "return_to_dock", "request_human_help"),
    "hazard": decision.NewScore("How severe is the current hazard?",
        "none", "low", "moderate", "high", "critical"),
    "needs_human": decision.NewBool("A human operator must intervene."),
}

answers, err := model.Decide(ctx, stateJSON, Questions)
\`\`\`

The architecture separates *fast* from *smart*:

- **A 1 kHz control loop** handles motion and hard safety reflexes. It **never waits on a model**. If something is 0.5 m away, the robot stops, whatever the model thinks.
- **A slow supervisor** (4 Hz) serializes the robot's state, asks the model its questions, and picks a behavior.
- **A policy gate** sits between them. It enforces a deadline, allows only one decision in flight at a time, and only lets the model act when its top answer clears a confidence threshold. Below that, the robot falls back to a cautious default.

That gate is the part I care about most. Probabilities are only useful if you're allowed to say "I'm not sure." A model that's 51% confident shouldn't steer a robot.

## Rules vs Laya

To see what this buys you, I built a small game: two identical robots face the same situation. The top one runs the if/else rules above. The bottom one acts on Laya's probabilities. **Every Laya number in it is a real model output**, computed by running the embedded model over each scene's description.

![Rules vs Laya: Laya stops early for a child running at the robot](/subhash-portfolio/blog/system-one/round2-child.jpg)

Three situations, each one designed to break a rule:

| Situation | If/else rules | Laya |
|---|---|---|
| A person ahead, **walking away** | \`person_within(8m)\` → slows down, ends 3.4 m behind | P(danger) = **12%** → keeps a safe gap, delivers |
| A child **running at** the robot | Just slows down, brakes only **2.1 m** from the child | P(danger) = **84%** → stops with **6.3 m** to spare |
| A box at the **edge** of the aisle, clear lane beside it | \`obstacle < 2m\` → stops and stays stuck | P(path blocked) = **2%** → planner drives around |

![Scoreboard: rules vs Laya](/subhash-portfolio/blog/system-one/scoreboard.jpg)

The rules aren't stupid; they're just blind to *meaning*. They check fields. Laya reads the situation and tells you how sure it is.

## What didn't work (yet)

This is where I want to be honest, because the game shows the good half of the story. Out of the box, Laya is **not** ready to drive a robot.

- **Asked as one big "what should the robot do?" choice, zero-shot Laya is close to guessing.** On seven test scenarios, it got two right, and only because it leans toward "keep driving." Its top probability sat between 30% and 42% almost regardless of the situation. Laya's own model card says the same thing: the base checkpoint is a starting point to specialize, not a zero-shot decision engine.
- **Focused yes/no questions work much better.** "Is someone in danger?" separates a child running at the robot (84%) from a person walking away (12%) without any training. That's why the game asks narrow questions instead of one broad one.
- **It can't do battery-range reasoning.** Asked whether the robot can reach the station on 12% battery, it was *more* confident with 35 m to go than with 3 m. I left that scenario out of the game rather than fake it.
- **Wording matters.** "Nothing and no one is ahead" scored P(blocked) = **99%**. Negations trip it up.
- **It's slow on my laptop's CPU.** Around 0.6–1.4 s for three questions with the fp16 export. Fine for a demo, not for a robot.

None of this surprised me once I read how these models are built. A System One model is a fast *intuition*, and intuition has to be trained on the domain you care about. Which brings me to what's next.

## Next step: RL on simple tasks

The plan is to improve the model with reinforcement learning on **simple, narrow tasks first**, exactly the kind of yes/no questions where zero-shot Laya is already halfway there, plus the ones where it fails, like battery range.

The key insight is that **a robot simulator is a free reward signal.** For any state, I can branch the simulation and roll it forward:

- *Can the robot reach the station on this battery?* Run it 20 times and count how often it makes it.
- *Is the path blocked?* Ask the planner whether a path exists.
- *Is someone in danger?* Check whether a rollout at the current speed ends with a person inside the safety envelope.

The empirical success rate becomes a **soft label**: not just "yes," but "yes, about 85% of the time." That matters, because what I want from the model isn't just the right answer, it's the right *confidence*.

So the reward is a **proper scoring rule** (log score or Brier score) against those outcome distributions. Proper scoring rules have a useful property: the model maximizes its reward only by reporting its true belief. Overconfidence gets punished as much as being wrong. Laya's training code already does a version of this: soft cross-entropy plus a REINFORCE-style term on noisy logits, rewarded by proper scoring rules with a GRPO-style group baseline. TypeSafe calls its own (undisclosed) method *RLCD*, reinforcement learning for calibrated decisions.

One honest caveat: in Laya's own single-seed ablation, plain soft cross-entropy slightly *beat* the RL variant (0.790 vs 0.772 accuracy). So I'll run both, with several seeds, and RL has to earn its place. Where I expect it to help is **outcome-defined tasks** like battery range, where the "right" probability comes from rollouts rather than a teacher model's opinion.

The curriculum I have in mind:

1. **Single-factor yes/no questions**: blocked? danger? can I reach the goal?
2. **Two-factor questions**, where the factors interact: low battery *and* near the goal, a person nearby *and* walking away.
3. **The full behavior choice**, built on top of the narrow skills.

After training I'll fit a temperature per question type on held-out data, and wrap decisions in a **conformal prediction** gate: the robot acts only when the model's prediction set contains exactly one option, and asks for help otherwise. That's the "know when you don't know" recipe from robot-planning research, applied to a System One head.

## The future: fine-tuned, on a sub-2 GB GPU

Here's the goal that would make this actually useful in real robotics: **a fine-tuned decision model running on a GPU with less than 2 GB of memory**, fast enough for a supervisory loop.

Why I think that's realistic (on paper; these are estimates I still have to measure):

- **Weights are small.** Laya is about 421M parameters. In fp16 that's roughly 850 MB, the size of the ONNX file I'm running today. Quantized to int8, about half that.
- **The working memory is modest.** It's an encoder that sees one short state description per question, not a model generating long text with a growing cache.
- **If that's still too heavy, there's a smaller route.** A fixed-schema model on ModernBERT-base (~150M parameters, ~300 MB in fp16) with one output head per question answers *all* questions in a single forward pass, instead of one pass per question.
- **The latency budget is forgiving.** A supervisor at 5–10 Hz needs a few questions answered in well under 100 ms. Laya's makers report about 40 ms per question on a T4, so a small GPU should be in the right range, especially after quantization.

The point of the sub-2 GB target is the hardware it unlocks: small embedded GPUs and low-end discrete cards that already sit on mobile robots, without a cloud dependency or a workstation-class GPU. A decision layer has to run where the robot is.

## Roadmap

- **Done:** Go runtime with embedded Laya over ONNX Runtime, a policy gate with confidence thresholds and deadlines, a 1 kHz control loop that never waits on the model, a simulator, a live dashboard, and the Rules vs Laya game.
- **Next:** a simulator-labeled dataset and RL / soft-label fine-tuning on simple yes/no tasks, starting with battery range, which Laya currently gets wrong.
- **Then:** calibration (temperature fitting plus a conformal gate), int8 export, and a parity test against the official Python package.
- **Goal:** under 100 ms for a full set of supervisor questions on a sub-2 GB GPU, then validation on real robot logs.

## Conclusion

Rules aren't going away, and they shouldn't: hard safety limits belong in plain code that a model can never override. But for the judgment calls in between, *is this person actually in my way, is this box actually blocking me*, a small model that reads the situation and admits its uncertainty is a better tool than another \`elif\`.

Zero-shot Laya already gets some of these calls right when you ask it narrow questions. Training it on simple tasks with rewards from a simulator, then shrinking it to fit a 2 GB GPU, is how I want to turn that from a demo into something a real robot can use.

If you're working on decision layers for robots, I'd love to compare notes.
`},{slug:"building-agentflow",title:"Building AgentFlow: Bridging Spring Boot and Local LLMs with Context",date:"2026-02-08",tags:["Java","Spring Boot","LLM","Llama.cpp","AI"],description:"A deep dive into building a stateful conversational agent using Spring Boot and local Llama models with custom memory management.",readTime:"5 min read",file:"building-agentflow.md",content:`
# Building \`agentFlow\`: Bridging Spring Boot and Local LLMs with Context

In the rapidly evolving world of AI, running Large Language Models (LLMs) locally has become a powerful way to build private, cost-effective, and low-latency applications. Today, I want to walk you through \`agentFlow\`, a project I've been working on that explores how to integrate a local Llama.cpp instance with a robust Spring Boot backend, focusing specifically on solving the "stateless" nature of LLMs by implementing a custom memory layer.

## The Goal

The core objective of \`agentFlow\` was simple yet ambitious: create a chat interface that talks to a local LLM but maintains conversation history across multiple turns. Most raw LLM APIs are stateless—they don't remember what you said five seconds ago. To build a true "agent" or helpful assistant, we need to manage that state ourselves.

## Tech Stack

*   **Backend:** Java 17, Spring Boot 3.2.1 (Web, WebFlux)
*   **AI Engine:** Llama.cpp (running locally)
*   **Frontend:** Vanilla HTML/CSS/JS (Lightweight, no build steps required)
*   **Testing:** Python (\`requests\` for API benchmarking)

## Architecture Overview

The application follows a clean, layered architecture:

1.  **Frontend (The Client):** A dual-pane web interface that simultaneously queries a stateless endpoint and a stateful conversation endpoint to demonstrate the difference in real-time.
2.  **REST Controller (\`AgentController\`):** Exposes API endpoints for creating conversations, sending messages, and simple generation.
3.  **Memory Layer (\`InMemoryConversationMemory\`):** A thread-safe component that stores conversation history (\`System\`, \`User\`, \`Assistant\` messages) mapped to unique Conversation IDs.
4.  **LLM Service (\`LlamaCppClient\`):** The bridge to the AI. It formats the accumulated context into a prompt the model can understand and sends it to the Llama.cpp server.

## Implementation Highlights

### 1. The Memory Layer

One of the key challenges was managing state. I implemented a simple in-memory store using \`ConcurrentHashMap\`. This allows for fast retrieval and thread-safety, although the data is ephemeral (lost on restart).

\`\`\`java
@Component
public class InMemoryConversationMemory implements ConversationMemory {

    private final ConcurrentHashMap<String, Conversation> conversations = new ConcurrentHashMap<>();

    @Override
    public void addMessage(String conversationId, Message message) {
        Conversation conversation = conversations.get(conversationId);
        if (conversation != null) {
            conversation.addMessage(message);
        }
    }
    
    // ... retrieval and management methods
}
\`\`\`

### 2. Prompt Engineering & Context Management

Sending just the latest message to an LLM isn't enough for a chat. We need to send the *entire* relevant history. The \`LlamaCppClient\` takes the conversation history and formats it into a prompt structure that Llama models expect (often referred to as "ChatML" or similar instruction formats).

\`\`\`java
private String formatConversation(String systemPrompt, List<Message> history) {
    StringBuilder sb = new StringBuilder();

    if (systemPrompt != null) {
        sb.append("System: ").append(systemPrompt).append("\\n\\n");
    }

    for (Message message : history) {
        // Map roles to specific prompt markers
        String roleLabel = switch (message.role().toLowerCase()) {
            case "user" -> "User";
            case "assistant" -> "Assistant";
            default -> message.role();
        };
        sb.append(roleLabel).append(": ").append(message.content()).append("\\n\\n");
    }

    sb.append("Assistant:");
    return sb.toString();
}
\`\`\`

This manual formatting is crucial. It ensures the model understands who said what and that it is expected to generate the *next* response as the "Assistant".

### 3. Asynchronous Integration

To keep the application responsive, I used Spring WebFlux's \`WebClient\`. While the current implementation blocks for the final response (classic Servlet model), the underlying client is non-blocking, paving the way for future streaming implementations.

\`\`\`java
String response = webClient.post()
        .uri("/completion")
        .bodyValue(request)
        .retrieve()
        .bodyToMono(LlamaCompletionResponse.class)
        // ...
        .block();
\`\`\`

## The Frontend: Visualizing Memory

To truly see the value of memory, I built a split-screen UI.

*   **Left Pane (Stateless):** Sends only the current prompt. The model forgets context immediately.
*   **Right Pane (Stateful):** Sends the conversation ID. The backend retrieves history, builds the full prompt, and the model replies with full context awareness.

This visual difference is striking. You can tell the stateless side "My name is Alex", and in the next turn ask "What is my name?"—it will fail. The stateful side, however, answers correctly.

## Challenges & Learnings

*   **Context Window Limits:** Local models have finite context (e.g., 4096 tokens). As conversations grow, we need strategies to truncate or summarize older messages. Currently, \`agentFlow\` sends the full history, which works for short demos but would need a "rolling window" for production.
*   **Prompt Sensitivity:** Llama models are sensitive to exact formatting (spacing, newlines, role names). Getting the \`formatConversation\` logic right was a process of trial and error.
*   **Latency:** Running LLMs on CPU (or even consumer GPU) can be slow. The "Stateful" approach adds slightly more latency because the prompt gets longer with every turn, increasing the processing time per token.

## Conclusion

\`agentFlow\` demonstrates that bringing robust software engineering practices (Spring Boot, Layered Arch) to the world of AI (Llama.cpp) is not only possible but highly effective. It turns a raw text generation engine into a capable conversational partner.

Future improvements could include persistent storage (PostgreSQL), semantic search for "Long Term Memory" (RAG), and Server-Sent Events (SSE) for real-time token streaming to improve perceived latency.

Check out the code on [GitHub](https://github.com/slyezil/agentFlow) and try running your own local agent today!
`}];export{e as P};
