const { PKPass } = require("passkit-generator");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://ijveuheldszomunyohrr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqdmV1aGVsZHN6b211bnlvaHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTQwMjAsImV4cCI6MjA4ODgzMDAyMH0.gsqkGqJ5JDdOGzU8fplzutCJKSNdAiDWSq31l6778cI";

// Icon PNG: 29x29 spark bolt on dark circle
const ICON_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAA2UlEQVR4nMWWyw3DMAxDLaID9ODu1hG7W3XoBi1yCOAEsqyPG/OamM+knE8pC0Sem2ut3941ZjZ7UQYU3QBmAy3ryLvw/byrwMfrM0wMD9Cr2vHBTGCbUvODBziqtqd68sWsSqWUrVp/9fT+S5hhMkopQi3VRufZaufg6pSbbiUpqYHRRpCFeoFmqHWe1qpRFoiiL4ZzemtKZiZ4P8BZYFn1yOBq4AFqrXiv1gvkxv+Q1DvbCFCsVwNHUrLgJ85UA2eBm9Q6Mx92bePq6Y3OeLSOPGaz/vCX6AdAg21BKsDGNAAAAABJRU5ErkJggg==", "base64");

// Icon@2x PNG: 58x58
const ICON_2X_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAYAAADhu0ooAAABhElEQVR4nOWbQXLCMAxFpT8coAtztx6xd8OL3qDd0JmMmxBj68uK/XcwxNLjSyYJisgiUnaAlNJPzedyztRcdBSYN7hGA2QBa1RAa2CNDmgFjCtB9sRWjyAR3MVVId/NSa0X3NPj86P52PvXt4mzuKKTLTmidwGmatyszRVCVk/ZWgozuFmTM949ILrSQe700vVy80xgujmqP9MOA1Zw8x/olXuzVCpYwjnKElhutvSnddmmDdN6js66CYUDZQsR+pPpZnqyreXozL35p5sMVm2Z934hEGMxzm8tXIcEl1VpQxYRJLAsNypE7U/r3RgSUIyfHB1xLfrKeWvI/Ly57e6oJ2T40p0a9O51mZbJwxKvypYFmTdMy5zUY/uC6eqem0zIXLAMd9RLKN/w6FVvN90cLcvWqy9PQZmusiHzQe6HjjJgR0G6/uM9olyrQb02Jgud5YreBSK4aTJ+0wsbAXKpETltCTAauKXC4BXISq2xtTfw9IPJy42aL/fwQPTHQWQV/QLz8MWkRvtl/wAAAABJRU5ErkJggg==", "base64");

// Logo PNG: VITTA UP text
const LOGO_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAKAAAAAyCAYAAADbYdBlAAADvklEQVR4nO3ZSahcRRTG8f/RhKAg4oSKKIoVwQkUCSoiiMYBhRiJaHwxgwtXFg6rbHQnIi4CxkKyU2KcUVFREJxABAdwwCgurihoxKcEpwQFjUcOVodO2/26+/nyck1/P7jc7nurq6ub6lPnVIOIiIiIiIiIiIiIiIiIiIiIiIiI/N/ZqA09pyuBl4CfgWOsNL/P0PY9YAlwl5Xm7nrtJ+BQ4CQrzVee0xPA9WOM9f5433FfY6W5vc/4YmwxxrDeSnPfGH3KHDpgjLavANN1Ei0b1MhzWlwnnwNbaKd1XY9X78NxTLwFoza00uzynB4D7gBuBJ4a0DTuhbci0s3Q30ogjt08pwLc0h05+5jNa7rbLwJuAH4FdgBneE5nWWk+Gvba3X24rweuAa4ys+197sc4lgIXmNkud78VmOrT1Y/Ax8ADZraNCTROBAyP1PMVntMRA9pM9bRtm+XAYcAzwJP12pp5eu9lZnZeHDE5gQwcC2xy90OYQGNNQCvNh8BWYGG/XMxzii82AZEfPk073VTPm4HIQ8OU53TgfA4iIqOZfQFsBI4CLmYCjRsBuyNbZ6nttqqen7fSRLHSKp7TccClwNfAm1aad4EvgaPr9X1hup4jEk6c2UzAKCz+As73nE7uXPScFnRFxbYuv2vqZ95ipYkiia5cdr6W4V4n1PM3TKCxJ6CV5lvgtZ6IFy6rS8n3tWJuc/Uby29HZxle7jnNWx7m7gvd/UzgNuCHru90oswmAg5ahjuPH7fS/EnLeE6R9J8CvG+l+bxzvVa/8fwgYMWo3c2y3Qvu/k4csUvAP/nfdzEJzew3JtDI2zA9ngUeBBZ7TufWwuTqPtGljcXHEs9p0ASKZfjhEfr6ZcgPOK7vMLNIVXqr4Fgh5L9EQCvNTuC5rsgXe2IHA59aaT6gZTynGNt1IzS9yHM6foR2nUkUKUc/h3cVF7IXImAn0q2uhcepLS8+YmmN/G6rlSbyrn/xnD6JTema1947pL+36/IaWyef7dGP+5HA6ZGKzOkn2E/NNgcMrwPbahS4pFbGj9Lu5XfTDG0eGvWvOTObrj+2le5+bWwiu/sidz8b2ABsb/HfkPvHBLTS9E64N6w0rdtK8JxOjKUV2DkkQse9P4DTPKdzhvVrZpED3wNcXtORV4E7gChq1ppZJ0+UvRQBewuOzS3eerFanQ+cFFaa2Ap5cZw9QTN72cxuNrOlZnahma0wsw1mtscmvJltrH/BqQARERERERERERERERERERERERERERERERHmwN9U3QwAfBxiwQAAAABJRU5ErkJggg==", "base64");

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // Get token from query or header
    const token = req.query.token || (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token" });

    // Authenticate user
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name, points_balance, streak_days")
      .eq("id", user.id)
      .single();

    if (!profile) return res.status(404).json({ error: "Profile not found" });

    // Decode certificates from env vars (base64 encoded)
    const wwdr = Buffer.from(process.env.APPLE_WWDR_B64 || "", "base64");
    const signerCert = Buffer.from(process.env.PASS_CERT_B64 || "", "base64");
    const signerKey = Buffer.from(process.env.PASS_KEY_B64 || "", "base64");

    // Generate pass
    const pass = new PKPass(
      {
        "icon.png": ICON_PNG,
        "icon@2x.png": ICON_2X_PNG,
        "logo.png": LOGO_PNG,
      },
      {
        wwdr,
        signerCert,
        signerKey,
      },
      {
        formatVersion: 1,
        passTypeIdentifier: "pass.fit.vittaup.loyalty",
        teamIdentifier: process.env.PASS_TEAM_ID || "SF25T2VT4C",
        organizationName: "VITTA UP",
        serialNumber: `vittaup-${user.id.slice(0, 8)}-${Date.now()}`,
        description: "VITTA UP Sparks Card",
        foregroundColor: "rgb(255, 255, 255)",
        backgroundColor: "rgb(13, 13, 13)",
        labelColor: "rgb(255, 172, 125)",
      }
    );

    pass.type = "storeCard";

    pass.headerFields.push({
      key: "balance",
      label: "SPARKS",
      value: profile.points_balance || 0,
      textAlignment: "PKTextAlignmentRight",
    });

    pass.primaryFields.push({
      key: "name",
      label: "MEMBRO",
      value: profile.name || "Corredor",
    });

    pass.secondaryFields.push({
      key: "streak",
      label: "STREAK",
      value: `${profile.streak_days || 0} semanas`,
    });

    pass.backFields.push(
      { key: "info", label: "Sobre", value: "Apresente este cartao em parceiros VITTA UP para resgatar seus sparks." },
      { key: "terms", label: "Termos", value: "Sparks nao tem valor monetario. Sujeito aos termos de uso." }
    );

    pass.setBarcodes({
      format: "PKBarcodeFormatQR",
      message: JSON.stringify({ uid: user.id }),
      messageEncoding: "iso-8859-1",
    });

    const buffer = pass.getAsBuffer();

    res.setHeader("Content-Type", "application/vnd.apple.pkpass");
    res.setHeader("Content-Disposition", 'attachment; filename="vittaup-sparks.pkpass"');
    return res.status(200).send(buffer);

  } catch (e) {
    console.error("Pass generation error:", e);
    return res.status(500).json({ error: e.message || "Failed to generate pass" });
  }
};
