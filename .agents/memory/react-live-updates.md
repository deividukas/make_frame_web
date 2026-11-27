---
name: React live updates
description: Why shared React context must remain separate from component refresh boundaries.
---

Keep shared React context and its consumer hook outside the provider component module.

**Why:** Editing a module that exported both the provider and hook caused live updates to recreate the context while existing consumers retained the previous identity, producing a missing-provider crash despite correct nesting.

**How to apply:** Preserve this separation when changing content management. Verify the page after a live update as well as a fresh load.
