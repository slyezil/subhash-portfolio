---
title: "Building AgentFlow: Bridging Spring Boot and Local LLMs with Context"
date: "2026-02-08"
tags: ["Java", "Spring Boot", "LLM", "Llama.cpp", "AI"]
description: "A deep dive into building a stateful conversational agent using Spring Boot and local Llama models with custom memory management."
---

# Building `agentFlow`: Bridging Spring Boot and Local LLMs with Context

In the rapidly evolving world of AI, running Large Language Models (LLMs) locally has become a powerful way to build private, cost-effective, and low-latency applications. Today, I want to walk you through `agentFlow`, a project I've been working on that explores how to integrate a local Llama.cpp instance with a robust Spring Boot backend, focusing specifically on solving the "stateless" nature of LLMs by implementing a custom memory layer.

## The Goal

The core objective of `agentFlow` was simple yet ambitious: create a chat interface that talks to a local LLM but maintains conversation history across multiple turns. Most raw LLM APIs are stateless—they don't remember what you said five seconds ago. To build a true "agent" or helpful assistant, we need to manage that state ourselves.

## Tech Stack

*   **Backend:** Java 17, Spring Boot 3.2.1 (Web, WebFlux)
*   **AI Engine:** Llama.cpp (running locally)
*   **Frontend:** Vanilla HTML/CSS/JS (Lightweight, no build steps required)
*   **Testing:** Python (`requests` for API benchmarking)

## Architecture Overview

The application follows a clean, layered architecture:

1.  **Frontend (The Client):** A dual-pane web interface that simultaneously queries a stateless endpoint and a stateful conversation endpoint to demonstrate the difference in real-time.
2.  **REST Controller (`AgentController`):** Exposes API endpoints for creating conversations, sending messages, and simple generation.
3.  **Memory Layer (`InMemoryConversationMemory`):** A thread-safe component that stores conversation history (`System`, `User`, `Assistant` messages) mapped to unique Conversation IDs.
4.  **LLM Service (`LlamaCppClient`):** The bridge to the AI. It formats the accumulated context into a prompt the model can understand and sends it to the Llama.cpp server.

## Implementation Highlights

### 1. The Memory Layer

One of the key challenges was managing state. I implemented a simple in-memory store using `ConcurrentHashMap`. This allows for fast retrieval and thread-safety, although the data is ephemeral (lost on restart).

```java
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
```

### 2. Prompt Engineering & Context Management

Sending just the latest message to an LLM isn't enough for a chat. We need to send the *entire* relevant history. The `LlamaCppClient` takes the conversation history and formats it into a prompt structure that Llama models expect (often referred to as "ChatML" or similar instruction formats).

```java
private String formatConversation(String systemPrompt, List<Message> history) {
    StringBuilder sb = new StringBuilder();

    if (systemPrompt != null) {
        sb.append("System: ").append(systemPrompt).append("\n\n");
    }

    for (Message message : history) {
        // Map roles to specific prompt markers
        String roleLabel = switch (message.role().toLowerCase()) {
            case "user" -> "User";
            case "assistant" -> "Assistant";
            default -> message.role();
        };
        sb.append(roleLabel).append(": ").append(message.content()).append("\n\n");
    }

    sb.append("Assistant:");
    return sb.toString();
}
```

This manual formatting is crucial. It ensures the model understands who said what and that it is expected to generate the *next* response as the "Assistant".

### 3. Asynchronous Integration

To keep the application responsive, I used Spring WebFlux's `WebClient`. While the current implementation blocks for the final response (classic Servlet model), the underlying client is non-blocking, paving the way for future streaming implementations.

```java
String response = webClient.post()
        .uri("/completion")
        .bodyValue(request)
        .retrieve()
        .bodyToMono(LlamaCompletionResponse.class)
        // ...
        .block();
```

## The Frontend: Visualizing Memory

To truly see the value of memory, I built a split-screen UI.

*   **Left Pane (Stateless):** Sends only the current prompt. The model forgets context immediately.
*   **Right Pane (Stateful):** Sends the conversation ID. The backend retrieves history, builds the full prompt, and the model replies with full context awareness.

This visual difference is striking. You can tell the stateless side "My name is Alex", and in the next turn ask "What is my name?"—it will fail. The stateful side, however, answers correctly.

## Challenges & Learnings

*   **Context Window Limits:** Local models have finite context (e.g., 4096 tokens). As conversations grow, we need strategies to truncate or summarize older messages. Currently, `agentFlow` sends the full history, which works for short demos but would need a "rolling window" for production.
*   **Prompt Sensitivity:** Llama models are sensitive to exact formatting (spacing, newlines, role names). Getting the `formatConversation` logic right was a process of trial and error.
*   **Latency:** Running LLMs on CPU (or even consumer GPU) can be slow. The "Stateful" approach adds slightly more latency because the prompt gets longer with every turn, increasing the processing time per token.

## Conclusion

`agentFlow` demonstrates that bringing robust software engineering practices (Spring Boot, Layered Arch) to the world of AI (Llama.cpp) is not only possible but highly effective. It turns a raw text generation engine into a capable conversational partner.

Future improvements could include persistent storage (PostgreSQL), semantic search for "Long Term Memory" (RAG), and Server-Sent Events (SSE) for real-time token streaming to improve perceived latency.

Check out the code on [GitHub](https://github.com/slyezil/agentFlow) and try running your own local agent today!
