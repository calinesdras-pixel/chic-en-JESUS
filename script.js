document.addEventListener('DOMContentLoaded', function () {

  // ===== MENU MOBILE =====
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('change', function () {
      if (this.checked) {
        navLinks.style.display = 'flex';
      } else {
        navLinks.style.display = '';
      }
    });
  }

  // ===== ANIMATIONS AU SCROLL =====
  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });
    fadeElements.forEach(el => observer.observe(el));
  } else {
    // fallback
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // ===== TOAST SYSTEM =====
  function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || (() => {
      const c = document.createElement('div');
      c.className = 'toast-container';
      document.body.appendChild(c);
      return c;
    })();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3500);
  }

  // ===== VALIDATION DES FORMULAIRES =====
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;
      const inputs = this.querySelectorAll('input[required], textarea[required]');
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderBottomColor = '#e74c3c';
          setTimeout(() => {
            input.style.borderBottomColor = '';
          }, 2000);
        } else {
          input.style.borderBottomColor = '';
        }
      });

      if (isValid) {
        // Simulation d'envoi
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'Envoi...';
          submitBtn.disabled = true;
          setTimeout(() => {
            showToast('Connexion réussi !', 'success');
            submitBtn.textContent = 'Envoyer';
            submitBtn.disabled = false;
            this.reset();
          }, 1200);
        }
      } else {
        showToast('⚠️ Veuillez remplir tous les champs obligatoires.', 'error');
      }
    });
  });

  // ===== PANIER / ACHAT (simulation) =====
  let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

  // Créer l'icône du panier si elle n'existe pas
  const navList = document.querySelector('.nav-links');
  if (navList && !document.querySelector('.cart-icon')) {
    const cartLi = document.createElement('li');
    cartLi.innerHTML = `
      <a href="https://wa.me/24174225234?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20les%20v%C3%AAtements%20de%20la%20marque%20Chic%20en%20JESUS" class="cart-icon">
          <img src="whatsapp.svg" alt="whatsapp" class="navbar-logo-img">
      </a>
    `;
    navList.appendChild(cartLi);
  }

  // Mettre à jour le badge
  function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = cartCount;
    }
    localStorage.setItem('cartCount', cartCount);
  }

  // Ajouter au panier
  document.addEventListener('click', function (e) {
    const target = e.target.closest('.btn-whatsapp-acheter, .product-card-action .btn-primary a');
    if (target && target.href && target.href.includes('wa.me')) {
      e.preventDefault();
      cartCount += 1;
      updateCartBadge();
      showToast('🛒 Article ajouté au panier !', 'success');
      // Redirection vers WhatsApp après un court délai
      setTimeout(() => {
        window.open(target.href, '_blank');
      }, 800);
    }
  });

  // ===== EFFETS DE SURVOL PERSONNALISÉS =====
  // Ajout d'un effet de brillance sur les cartes de produit
  document.querySelectorAll('.product-card, .collection-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.4s ease';
    });
  });

  // ===== NAVBAR ACTIVE LINK =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.btn-primary)').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ===== INIT =====
  updateCartBadge();

  console.log('✨ Chic en JESUS — Site interactif chargé');
});
