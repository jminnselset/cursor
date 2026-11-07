# Copilot instructions — Nemko / Microsoft environment

These instructions apply when assisting developers in this organization after the Cursor → VS Code migration.

## Environment preferences

- Prefer **Visual Studio Code** + **GitHub Copilot** (Business/Enterprise via `nemkogroup`) over Cursor-specific workflows.
- Prefer **Microsoft** services when suggesting tools: Entra ID, Microsoft 365, Outlook, OneDrive, Azure, GitHub Enterprise / Copilot.
- Do not recommend Cursor Cloud Agents, Cursor Rules (`.cursorrules`), or Cursor-only MCP setups as the default path.
- When suggesting AI editor config, use VS Code / Copilot locations:
  - Workspace instructions: `.github/copilot-instructions.md`
  - MCP (VS Code): `.vscode/mcp.json`
  - Portable Copilot MCP (harness): `.mcp.json`

## Integrations / MCP

- Default allowlist: Microsoft Graph–backed tools (Outlook, OneDrive) and org-approved Copilot connectors.
- Do not enable or recommend Google Workspace MCP (Gmail, Google Drive, Docs, Calendar), Home Assistant, or other third-party MCPs unless an org owner explicitly allows them.
- Never put secrets, tokens, or API keys in repo files. Use GitHub Environments, Azure Key Vault, or VS Code secret inputs.

## Coding guidance

- Match existing project conventions; do not invent a new stack without asking.
- Prefer small, reviewable changes and clear commit messages.
- Do not commit credentials, `.env` files with secrets, or personal access tokens.
- For auth to Microsoft services, never suggest device-code / device authentication flows.

## Agent behavior

- Prefer Copilot **Agent** mode for multi-step repo tasks; keep Ask/Edit for explanations and small edits.
- Confirm before destructive actions (delete repo data, force-push, revoke org policies).
- When org Copilot model policy blocks a model, fall back to an enabled model or Auto — do not tell the user to switch back to Cursor.
