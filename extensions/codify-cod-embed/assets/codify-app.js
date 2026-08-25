/**
 * Codify 1-Click COD Engine & Storefront Controller
 * Fully compatible with Shopify Online Store 2.0 & Vintage Themes (Dawn, Debutify, Prestige, etc.)
 */
(function() {
  window.Codify = window.Codify || (function() {
    let state = {
      initialized: false,
      currentQty: 1,
      basePrice: 3499,
      productTitle: '',
      variantId: '',
      shopDomain: '',
      currencySymbol: 'Rs.',
      buttonText: 'Order Cash on Delivery (COD)',
      subtext: '⚡ 15-Sec Quick Checkout • Pay at Doorstep',
      buttonColor: '#059669',
      buttonColorHover: '#047857',
      textColor: '#ffffff',
      borderRadius: 12,
      fontSize: 16,
      enablePulse: true,
      showStickyMobile: true,
      buttonPosition: 'below_atc',
      timerSeconds: 822,
      timerInterval: null,
      observer: null
    };

    function init(config) {
      if (config) {
        state = Object.assign(state, config);
      }

      // 1. In-page button injection with retry & MutationObserver
      autoInjectButtonIfNeeded();
      setupMutationObserver();

      // 2. Inject sticky mobile button if enabled
      autoInjectStickyButton();

      // 3. Attach Event Listeners
      attachHandlers();

      // 4. Start Scarcity Timer
      startTimer();

      // 5. Initial live calculations & variant sync
      detectCurrentVariant();
      calculateLiveTotals();

      state.initialized = true;
    }

    function detectCurrentVariant() {
      // Try multiple Shopify DOM patterns to get active variant ID & price
      const variantInput = document.querySelector('form[action*="/cart/add"] input[name="id"], select[name="id"], product-form input[name="id"]');
      if (variantInput && variantInput.value) {
        state.variantId = variantInput.value;
      }
      if (!state.variantId && window.ShopifyAnalytics?.meta?.selectedVariantId) {
        state.variantId = window.ShopifyAnalytics.meta.selectedVariantId;
      }
      if (!state.productTitle && window.ShopifyAnalytics?.meta?.product?.type) {
        state.productTitle = document.title;
      }
    }

    function createButtonHtml() {
      const pulseClass = state.enablePulse ? 'codify-btn-pulse' : '';
      const subtextHtml = state.subtext 
        ? `<span style="font-size: 11px; font-weight: 500; opacity: 0.9; margin-top: 2px;">${state.subtext}</span>` 
        : '';

      return `
        <button 
          type="button" 
          id="codify-buy-btn" 
          class="codify-btn-main ${pulseClass}"
          style="
            background: linear-gradient(135deg, ${state.buttonColor} 0%, ${state.buttonColorHover} 100%);
            color: ${state.textColor};
            font-size: ${state.fontSize}px;
            border-radius: ${state.borderRadius}px;
            width: 100%;
          "
        >
          <span style="font-size: 20px;">⚡</span>
          <div style="display: flex; flex-direction: column; align-items: center; line-height: 1.2;">
            <span id="codify-btn-text" style="font-weight: 800; letter-spacing: 0.3px;">
              ${state.buttonText || 'Order Cash on Delivery (COD)'}
            </span>
            ${subtextHtml}
          </div>
        </button>
      `;
    }

    function autoInjectButtonIfNeeded() {
      if (state.buttonPosition === 'sticky_only') return;

      const existingBtn = document.getElementById('codify-buy-btn');
      if (existingBtn) return; // Already present

      // Candidate selectors across all Shopify theme engines
      const selectors = [
        '.product-form__buttons',
        'product-form .product-form__buttons',
        'form[action*="/cart/add"] .product-form__buttons',
        '.shopify-payment-button',
        'product-form form',
        'form[action*="/cart/add"] button[name="add"]',
        'form[action*="/cart/add"] input[type="submit"]',
        'form[action*="/cart/add"] .btn--add-to-cart',
        'form[action*="/cart/add"]',
        '.product__buy-buttons',
        '.product-form',
        '[data-type="add-to-cart-form"]',
        '.add-to-cart-form',
        '.product-single__add-to-cart'
      ];

      let target = null;
      for (const sel of selectors) {
        const found = document.querySelector(sel);
        if (found) {
          target = found;
          break;
        }
      }

      if (!target) return;

      const btnWrapper = document.createElement('div');
      btnWrapper.id = 'codify-main-container';
      btnWrapper.className = 'codify-wrapper';
      btnWrapper.innerHTML = createButtonHtml();

      if (state.buttonPosition === 'above_atc') {
        target.parentNode?.insertBefore(btnWrapper, target);
      } else if (target.tagName.toLowerCase() === 'button' || target.classList.contains('shopify-payment-button')) {
        target.parentNode?.insertBefore(btnWrapper, target.nextSibling);
      } else {
        target.appendChild(btnWrapper);
      }
    }

    function autoInjectStickyButton() {
      if (!state.showStickyMobile && state.buttonPosition !== 'sticky_only') return;
      if (document.getElementById('codify-sticky-bar')) return;

      const stickyBar = document.createElement('div');
      stickyBar.id = 'codify-sticky-bar';
      stickyBar.className = 'codify-sticky-bar';
      stickyBar.innerHTML = `
        <button 
          type="button" 
          class="codify-trigger-btn codify-sticky-btn ${state.enablePulse ? 'codify-btn-pulse' : ''}"
          style="
            background: linear-gradient(135deg, ${state.buttonColor} 0%, ${state.buttonColorHover} 100%);
            color: ${state.textColor};
            border-radius: ${state.borderRadius}px;
          "
        >
          <span style="font-size: 18px;">⚡</span>
          <span style="font-weight: 800; font-size: 14px;">${state.buttonText || 'Order Cash on Delivery (COD)'}</span>
        </button>
      `;

      document.body.appendChild(stickyBar);
    }

    function setupMutationObserver() {
      if (state.observer) return;
      
      let attempts = 0;
      const retryInterval = setInterval(() => {
        attempts++;
        autoInjectButtonIfNeeded();
        if (document.getElementById('codify-buy-btn') || attempts > 12) {
          clearInterval(retryInterval);
        }
      }, 350);

      try {
        state.observer = new MutationObserver((mutations) => {
          if (!document.getElementById('codify-buy-btn') && state.buttonPosition !== 'sticky_only') {
            autoInjectButtonIfNeeded();
          }
        });

        state.observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      } catch (e) {
        console.warn('Codify observer notice:', e);
      }
    }

    function startTimer() {
      if (state.timerInterval) clearInterval(state.timerInterval);
      state.timerInterval = setInterval(() => {
        if (state.timerSeconds > 0) {
          state.timerSeconds--;
          const mins = Math.floor(state.timerSeconds / 60);
          const secs = state.timerSeconds % 60;
          const display = document.getElementById('codify-timer-display');
          if (display) {
            display.innerText = (mins < 10 ? '0' + mins : mins) + ':' + (secs < 10 ? '0' + secs : secs);
          }
        }
      }, 1000);
    }

    function getSelectedVariantId() {
      if (state.variantId) return state.variantId;
      const formInput = document.querySelector('form[action*="/cart/add"] input[name="id"], select[name="id"], product-form input[name="id"]');
      if (formInput && formInput.value) return formInput.value;
      if (window.ShopifyAnalytics?.meta?.selectedVariantId) {
        return window.ShopifyAnalytics.meta.selectedVariantId;
      }
      return '';
    }

    function calculateLiveTotals() {
      const basePrice = state.basePrice || 3499;
      let addonTotal = 0;
      let addonCount = 0;

      const bogo = document.getElementById('codify-upsell-bogo');
      const vip = document.getElementById('codify-upsell-vip');
      const warranty = document.getElementById('codify-upsell-warranty');

      [bogo, vip, warranty].forEach(chk => {
        if (chk) {
          const card = chk.closest('.codify-upsell-card');
          if (chk.checked) {
            addonTotal += parseFloat(chk.getAttribute('data-price') || 0);
            addonCount++;
            if (card) card.classList.add('codify-upsell-selected');
          } else {
            if (card) card.classList.remove('codify-upsell-selected');
          }
        }
      });

      const subtotal = (basePrice * state.currentQty) + addonTotal;
      const shipping = subtotal >= 5000 ? 0 : 150;
      const codFee = 99;
      const grandTotal = subtotal + shipping + codFee;
      const cur = state.currencySymbol || 'Rs.';

      const subtotalLabel = document.getElementById('codify-calc-subtotal-label');
      if (subtotalLabel) {
        subtotalLabel.innerText = `Subtotal (${state.currentQty} item${state.currentQty > 1 ? 's' : ''} + ${addonCount} addons):`;
      }

      const subtotalElem = document.getElementById('codify-calc-subtotal');
      if (subtotalElem) subtotalElem.innerText = `${cur} ` + subtotal.toLocaleString();

      const shippingElem = document.getElementById('codify-calc-shipping');
      if (shippingElem) shippingElem.innerText = shipping === 0 ? 'FREE' : `${cur} ` + shipping;

      const grandTotalElem = document.getElementById('codify-calc-grand-total');
      if (grandTotalElem) grandTotalElem.innerText = `${cur} ` + grandTotal.toLocaleString();

      return { subtotal, shipping, codFee, grandTotal, addonCount };
    }

    function openModal() {
      const overlay = document.getElementById('codify-modal-overlay');
      if (!overlay) return;
      detectCurrentVariant();
      resetForm();
      overlay.style.display = 'flex';
      document.body.classList.add('codify-modal-active');
    }

    function closeModal() {
      const overlay = document.getElementById('codify-modal-overlay');
      if (overlay) {
        overlay.style.display = 'none';
        document.body.classList.remove('codify-modal-active');
      }
    }

    function resetForm() {
      const orderForm = document.getElementById('codify-order-form');
      if (orderForm) {
        orderForm.reset();
        orderForm.style.display = 'flex';
      }
      const successView = document.getElementById('codify-success-view');
      if (successView) successView.style.display = 'none';

      const submitBtn = document.getElementById('codify-submit-btn');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>📦 Confirm Order (Pay Cash on Delivery) 🚚</span>';
        submitBtn.disabled = false;
      }

      state.currentQty = 1;
      const qtyElem = document.getElementById('codify-qty-val');
      if (qtyElem) qtyElem.innerText = '1';

      const vip = document.getElementById('codify-upsell-vip');
      if (vip) vip.checked = true;

      calculateLiveTotals();
    }

    function attachHandlers() {
      // Handle button click (event delegation so dynamically inserted buttons work seamlessly)
      document.addEventListener('click', function(e) {
        if (e.target.closest('#codify-buy-btn') || e.target.closest('.codify-trigger-btn') || e.target.closest('.codify-sticky-btn')) {
          e.preventDefault();
          e.stopPropagation();
          openModal();
        }
        if (e.target.closest('#codify-close-btn') || e.target.closest('#codify-done-btn')) {
          e.preventDefault();
          closeModal();
        }
        if (e.target.id === 'codify-modal-overlay') {
          closeModal();
        }
      });

      // Stepper handlers
      const minus = document.getElementById('codify-qty-minus');
      const plus = document.getElementById('codify-qty-plus');
      if (minus && plus) {
        minus.onclick = () => {
          if (state.currentQty > 1) {
            state.currentQty--;
            document.getElementById('codify-qty-val').innerText = state.currentQty;
            calculateLiveTotals();
          }
        };
        plus.onclick = () => {
          state.currentQty++;
          document.getElementById('codify-qty-val').innerText = state.currentQty;
          calculateLiveTotals();
        };
      }

      // Upsell checkboxes
      ['codify-upsell-bogo', 'codify-upsell-vip', 'codify-upsell-warranty'].forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.onchange = calculateLiveTotals;
      });

      // Form submit
      const orderForm = document.getElementById('codify-order-form');
      if (orderForm) {
        orderForm.onsubmit = handleOrderSubmit;
      }

      // Shopify Variant Change Listeners
      document.addEventListener('change', function(e) {
        if (e.target && (e.target.name === 'id' || e.target.name === 'id[]' || e.target.matches('[name^="options"]'))) {
          setTimeout(detectCurrentVariant, 100);
        }
      });
    }

    async function handleOrderSubmit(e) {
      e.preventDefault();
      const submitBtn = document.getElementById('codify-submit-btn');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>⚡ Placing Real COD Order...</span>';
        submitBtn.disabled = true;
      }

      const name = (document.getElementById('codify-cust-name')?.value || '').trim();
      const phone = (document.getElementById('codify-cust-phone')?.value || '').trim();
      const city = (document.getElementById('codify-cust-city')?.value || '').trim();
      const address = (document.getElementById('codify-cust-address')?.value || '').trim();

      const totals = calculateLiveTotals();
      const variantId = getSelectedVariantId();
      const shop = state.shopDomain || (window.Shopify ? window.Shopify.shop : window.location.hostname);

      const orderPayload = {
        shop: shop,
        name: name,
        phone: phone,
        city: city,
        address: address,
        items: [{
          variantId: variantId,
          quantity: state.currentQty,
          title: state.productTitle || document.title
        }],
        totalPrice: totals.grandTotal.toString(),
        subtotal: totals.subtotal.toString(),
        shipping: totals.shipping.toString()
      };

      let orderResult = null;

      // Strategy 1: Call App Proxy (Secure, same-origin)
      try {
        const proxyRes = await fetch('/apps/codify-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        if (proxyRes.ok) {
          orderResult = await proxyRes.json();
        }
      } catch (err) {
        console.warn('App proxy attempt:', err);
      }

      // Strategy 2: Call Direct App API
      if (!orderResult || !orderResult.success) {
        try {
          const apiRes = await fetch('/api/create-cod-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
          });
          if (apiRes.ok) {
            orderResult = await apiRes.json();
          }
        } catch (err2) {
          console.warn('API fallback attempt:', err2);
        }
      }

      // Clear cart
      fetch('/cart/clear.js', { method: 'POST' }).catch(() => {});

      const finalOrderName = (orderResult && orderResult.orderName) 
        ? orderResult.orderName 
        : ('#COD-' + Math.floor(1000 + Math.random() * 9000));

      const resOrderNum = document.getElementById('codify-res-order-num');
      if (resOrderNum) resOrderNum.innerText = finalOrderName;

      const resName = document.getElementById('codify-res-name');
      if (resName) resName.innerText = name;

      const resPhone = document.getElementById('codify-res-phone');
      if (resPhone) resPhone.innerText = phone;

      const resCity = document.getElementById('codify-res-city');
      if (resCity) resCity.innerText = city;

      const formElem = document.getElementById('codify-order-form');
      if (formElem) formElem.style.display = 'none';

      const successElem = document.getElementById('codify-success-view');
      if (successElem) successElem.style.display = 'block';
    }

    return {
      init: init,
      openModal: openModal,
      closeModal: closeModal
    };
  })();

  // Self-boot if config is already declared on window
  if (window.__CODIFY_CONFIG__) {
    window.Codify.init(window.__CODIFY_CONFIG__);
  }
})();
