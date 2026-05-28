# Social posts

"What if our expense-submission agent yeets all the receipts out of the bucket?"

Nobody wants that on a threat model. But how do you safely give an AI agent a shell?

Containers and microVMs are fine when you have a fixed number of agents. We're not heading toward a fixed number of agents. We need infrastructure that can multiplex hundreds of sessions on one server without kernel overhead eating us alive.

So Xe built that in Go based on work done in just-bash and agent-shell. Sandbox every agent in their own bucket fork so they can't hurt anything and delete that fork when it's done.

There's even a live demo! No authentication required because there's nothing to protect. Every session is its own little world.

Check it out on the blog: https://tigrisdata.com/blog/agent-sandbox-go
