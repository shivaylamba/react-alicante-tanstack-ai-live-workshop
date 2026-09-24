# 02 · Connect React to the stream

20 minutes: learn, build, experiment, and explain your result.

## Start here

Exercise 01's completed endpoint is provided. The React component, text renderer, form, Stop button and error display are supplied; its connection URL and busy-message policy are intentionally wrong.

```sh
npm run exercise -- 02
```

Edit files in `exercises/02-streaming/`:

- `Chat.tsx`

## Understand the concept

The server produces events; a React hook turns those events into message state. Rendering that state makes the interface update as text arrives. A queue holds later user messages while a response is still running.

The APIs and supplied helpers you will use:

- useChat comes from @tanstack/ai-react. messages is renderable conversation state; sendMessage submits text; isLoading reports work; stop cancels it.
- fetchServerSentEvents('/api/chat', options) connects the hook to our endpoint using SSE.
- queue.whenBusy='queue' holds a new message until the current run completes. cancelQueued(id) removes a waiting message.
- message.parts contains typed pieces. At this checkpoint we render text parts only; tools have not been introduced.
- onChunk observes protocol events for status labels. RUN_STARTED begins a run; TEXT_MESSAGE_CONTENT contains text; RUN_FINISHED ends it.

### Where AG-UI fits

The event names in onChunk are AG-UI events. RUN_STARTED means this run has begun, TEXT_MESSAGE_CONTENT carries another text delta, RUN_FINISHED marks successful completion, and RUN_ERROR reports failure. Our status labels translate those events into feedback. useChat() assembles the incoming events into messages and parts; a message part is client state, not the raw SSE frame. A delta is a text fragment, not necessarily one model token.

## Make a prediction

If a second message arrives while the first is streaming, should it disappear, interrupt, or wait?

Write down your prediction before changing the code.

## Build it

In Chat.tsx change /api/TODO-connect-chat to /api/chat and whenBusy from drop to queue. Read the supplied sendMessage, message.parts rendering and stop handlers before changing either line.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Experiment

Ask Explain T-shirt sizing in two sentences. In fixture mode select Slow stream — test Stop, send another message while output is arriving, inspect Waiting to send, cancel the queued message, then press Stop. Select No fault and send again. Try HTTP 429 and verify an error is visible before retrying with No fault.

## Check your result

Text appears in the chat. Slow output can be stopped; a busy message queues and can be cancelled. A failed request leaves the UI usable. There are no cart approvals or product tool calls yet.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

A 404 indicates the wrong connection URL. If the queued message disappears, inspect whenBusy. Use the slow fixture because live responses may complete too quickly to observe a queue.

Compare with [the reference solution](../../solutions/02-streaming/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 02
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
