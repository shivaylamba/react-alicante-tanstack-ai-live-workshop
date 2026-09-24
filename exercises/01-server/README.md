# 01 · A streaming server endpoint

10 minutes: learn, build, experiment, and explain your result.

## Start here

The manual storefront runs. The AI endpoint deliberately returns HTTP 501. There is no React chat composer yet.

```sh
npm run exercise -- 01
```

Edit files in `exercises/01-server/`:

- `server.ts`

## Understand the concept

A language model accepts messages and generates text. Streaming sends pieces of that text as they become available. Our server holds the Nebius key; the caller receives events, never the credential.

The APIs and supplied helpers you will use:

- readChatRequest(request) is our supplied helper: validates the JSON envelope and returns messages plus request identifiers.
- nebiusAdapter() is our supplied server-only connection to Nebius. The key is read from environment variables inside core-app/provider.ts.
- chat({ adapter, messages, ... }) comes from @tanstack/ai and creates the generation stream.
- toServerSentEventsResponse(stream, options) comes from @tanstack/ai and turns events into an HTTP Response.
- guardChatStream is supplied infrastructure: it bounds the stream and handles disconnection. Attendees do not implement it. threadId identifies a conversation; runId identifies this request.

## Make a prediction

Will curl receive one JSON object or several events? What observable header would distinguish them?

Write down your prediction before changing the code.

## Build it

In server.ts, replace the empty messages array with params.messages. Replace the 501 return and its starter cleanup with the supplied toServerSentEventsResponse call shown in the patch. The imports, adapter, identifiers, AbortController and cleanup generator are already present. Do not add tools, approval handling or an agentLoopStrategy.

Read the TODOs and the surrounding code. Try your implementation before opening the solution. You do not need to recreate the supplied infrastructure.

## Experiment

Run the endpoint probe below. Change only the content string to Explain streaming in one sentence and repeat. Then change messages to a string and repeat: the HTTP route should reject it. Restore the valid body. In fixture mode, changing words need not change the scripted answer.

Keep the server running and open a second terminal:

```sh
curl -i -N http://localhost:3000/api/chat -H 'Content-Type: application/json' --data '{"threadId":"lesson-01","runId":"probe-01","messages":[{"id":"m1","role":"user","content":"Explain tokens in one sentence"}],"tools":[],"context":[]}'
```

`-N` disables curl buffering. On Windows, use `curl.exe` and put the command on one line.

## Check your result

Valid input returns text/event-stream, a TEXT_MESSAGE_CONTENT event and RUN_FINISHED. Malformed input returns an error instead of a successful model answer. No tool calls occur.

Point to the changed code and explain why it produced the observed behavior. Record your prompt, mode and result in [your learning log](../../docs/LEARNING-LOG.md).

## If you get stuck

A 501 means TODO 01B is still active. An empty or irrelevant answer means check that messages is params.messages. A provider error means check the server environment or use fixture mode; never display the key.

Compare with [the reference solution](../../solutions/01-server/). To run it, stop your current server with Ctrl-C, then:

```sh
npm run solution -- 01
```

This does not overwrite your exercise files. Complete the experiment even if you use the solution to get unstuck.
