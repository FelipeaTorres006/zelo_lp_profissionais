// ================================================
// CONFIGURAÇÃO — COLE AQUI A URL DO APPS SCRIPT
// ================================================
// ATENÇÃO: Se você gerou um link novo lá no Apps Script, lembre-se de trocar aqui!
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxI4uqHTQqqpj1ySfDh57PUyGlpWwi5m-M-euZIqShOMC1NZzbhqY0PjPQkrNSNOksTxg/exec";

// Intersection Observer para animações de entrada
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((el) => {
      if (el.isIntersecting) el.target.classList.add("visible");
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Máscara de telefone
document.getElementById("whatsapp").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4}).*/, "($1) $2 $3-$4");
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else {
    v = v.replace(/^(\d*)/, "($1");
  }
  this.value = v;
});

// Envio do formulário
document
  .getElementById("formulario-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const campos = [
      "nome",
      "especialidade",
      "whatsapp",
      "cidade",
      "modalidade",
    ];
    let valido = true;

    campos.forEach((id) => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.style.borderColor = "var(--urgency)";
        valido = false;
      } else {
        el.style.borderColor = "var(--gray-200)";
      }
    });

    if (!valido) {
      const primeiro = campos.find(
        (id) => !document.getElementById(id).value.trim(),
      );
      document.getElementById(primeiro).focus();
      return;
    }

    const btn = document.getElementById("btn-enviar");
    const original = btn.textContent;
    btn.textContent = "Enviando...";
    btn.disabled = true;

    const dados = new URLSearchParams();
    dados.append("nome", document.getElementById("nome").value.trim());
    dados.append(
      "especialidade",
      document.getElementById("especialidade").value,
    );
    dados.append("whatsapp", document.getElementById("whatsapp").value.trim());
    dados.append("cidade", document.getElementById("cidade").value.trim());
    dados.append("valor", document.getElementById("valor").value.trim());
    dados.append("modalidade", document.getElementById("modalidade").value);

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: dados,
      });
      mostrarSucesso();
    } catch (err) {
      alert("Erro ao enviar. Tente novamente.");
      btn.textContent = original;
      btn.disabled = false;
    }
  });

function mostrarSucesso() {
  document.getElementById("formulario-form").innerHTML = `
    <div style="text-align:center;padding:32px 16px">
      <div style="width:64px;height:64px;background:var(--teal-50);border-radius:50%;
                  display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke="#0F6E56" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h3 style="font-family:'DM Serif Display',serif;font-size:22px;
                 color:var(--teal-600);margin-bottom:10px">Cadastro recebido!</h3>
      <p style="color:var(--gray-600);font-size:14px;line-height:1.6">
        Nossa equipe vai entrar em contato pelo seu WhatsApp em até 24 horas
        para ativar seu perfil na Zelo.
      </p>
    </div>
  `;
}
