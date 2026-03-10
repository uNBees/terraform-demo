const HTML = (links) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>uNBees.eth — Links</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --orange: #F6821F;
      --dark: #0A0A0B;
      --dark-2: #111114;
      --dark-3: #1A1A1F;
      --border: rgba(255,255,255,0.07);
      --text: #E8E8EC;
      --muted: #6B6B7A;
    }
    body {
      font-family: 'Geist Mono', monospace;
      background: var(--dark);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(246,130,31,0.1) 0%, transparent 60%);
      pointer-events: none;
    }
    .card {
      width: 100%;
      max-width: 480px;
      position: relative;
      z-index: 1;
      margin-top: 60px;
    }
    .profile {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--dark-3);
      border: 2px solid rgba(246,130,31,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1rem;
    }
    .name {
      font-family: 'Syne', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.03em;
      margin-bottom: 0.25rem;
    }
    .handle {
      font-size: 0.72rem;
      color: var(--orange);
      letter-spacing: 0.08em;
    }
    .terraform-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.62rem;
      color: var(--muted);
      background: var(--dark-2);
      border: 1px solid var(--border);
      padding: 0.25rem 0.65rem;
      border-radius: 100px;
      margin-top: 0.75rem;
      letter-spacing: 0.06em;
    }
    .terraform-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #7b61ff;
    }
    .links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .link-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      padding: 1rem 1.25rem;
      background: var(--dark-2);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: border-color 0.2s, transform 0.15s;
    }
    .link-item:hover {
      border-color: rgba(246,130,31,0.3);
      transform: translateY(-2px);
    }
    .link-icon {
      font-size: 1rem;
      width: 24px;
      text-align: center;
      flex-shrink: 0;
    }
    .link-title {
      font-size: 0.85rem;
      color: var(--text);
      flex: 1;
      font-weight: 500;
    }
    .link-arrow {
      color: var(--muted);
      font-size: 0.8rem;
    }
    .footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.62rem;
      color: var(--muted);
      letter-spacing: 0.06em;
    }
    .footer a { color: var(--orange); text-decoration: none; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .card { animation: fadeUp 0.5s ease both; }
  </style>
</head>
<body>
  <header style="display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:60px;background:rgba(10,10,11,0.85);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.07);position:fixed;top:0;left:0;right:0;z-index:100;">
    <a href="https://build.siliceoroman.xyz" style="font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;color:#E8E8EC;text-decoration:none;letter-spacing:-0.02em;">Build on <span style="color:#F6821F;">Cloudflare</span></a>
    <a href="https://build.siliceoroman.xyz" style="font-family:'Geist Mono',monospace;font-size:0.72rem;color:#6B6B7A;text-decoration:none;">← Back to projects</a>
  </header>
  <div class="card">
    <div class="profile">
      <div class="avatar">🐝</div>
      <div class="name">Armando Siliceo-Roman</div>
      <div class="handle">uNBees.eth</div>
      <div class="terraform-badge">
        <div class="terraform-dot"></div>
        Provisioned with Terraform
      </div>
    </div>
    <div class="links">
      ${links.map(link => `
      <a href="${link.url}" target="_blank" class="link-item">
        <span class="link-icon">${link.icon}</span>
        <span class="link-title">${link.title}</span>
        <span class="link-arrow">↗</span>
      </a>`).join('')}
    </div>
    <div class="footer">
      Infrastructure as Code · <a href="https://build.siliceoroman.xyz">Build on Cloudflare</a>
    </div>
  </div>
</body>
</html>`;

export default {
  async fetch(request, env) {
    try {
      // List all keys from KV
      const { keys } = await env.LINKS.list();

      // Fetch all link values
      const links = await Promise.all(
        keys.map(async ({ name }) => {
          const value = await env.LINKS.get(name);
          return JSON.parse(value);
        })
      );

      return new Response(HTML(links), {
        headers: { "Content-Type": "text/html" }
      });
    } catch (e) {
      return new Response("Error loading links: " + e.message, { status: 500 });
    }
  }
};