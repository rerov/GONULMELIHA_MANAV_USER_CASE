if (window.location.pathname === "/") {
  (() => {
    const PRODUCTS =
      "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";
    const PRODUCT_LOCAL_STORAGE_KEY = "wechooseforyou_products_carousel";
    const FAVORITE_LOCAL_STORAGE_KEY = "wechooseforyou_favorite_products";
    const PARENT_SELECTOR = ".ins-preview-wrapper";

    let products = [];
    let currentIndex = 0;
    let itemsToShow = 4;
    let favoriteProductIds = [];

    const init = async () => {
      const storedFavorites = localStorage.getItem(FAVORITE_LOCAL_STORAGE_KEY);
      if (storedFavorites) {
        favoriteProductIds = JSON.parse(storedFavorites);
      }

      products = await fetchProducts();
      if (products.length > 0) {
        buildHTML(products);
        buildCSS();
        setEvents();
        handleResize();
        window.addEventListener("resize", handleResize);
      } else {
        console.warn("Unable to load products.");
      }
    };

    async function fetchProducts() {
      const localData = localStorage.getItem(PRODUCT_LOCAL_STORAGE_KEY);
      if (localData) {
        console.log("Products are loaded from localStorage.");
        return JSON.parse(localData);
      }

      try {
        const response = await fetch(PRODUCTS);
        if (!response.ok)
          throw new Error("İstek başarısız oldu: " + response.status);
        const data = await response.json();
        localStorage.setItem(PRODUCT_LOCAL_STORAGE_KEY, JSON.stringify(data));
        return data;
      } catch (error) {
        console.error("Unable to fetch products:", error);
        return [];
      }
    }

    const buildHTML = (products) => {
      const parent = document.querySelector(PARENT_SELECTOR);
      if (!parent) {
        console.warn(
          `'${PARENT_SELECTOR}' selector not found. Please check the selector.`
        );
        return;
      }

      const mainContainer = document.createElement("div");
      mainContainer.id = "ebWeChooseForYouBanner";
      mainContainer.className = "eb-wechoose-main-container";

      mainContainer.innerHTML = `
        <div class="container">
          <div class="eb-wechoose-banner-title">
            <h2 class="eb-wechoose-title-primary">Beğenebileceğinizi düşündüklerimiz</h2>
          </div>
          <div class="eb-wechoose-slider-main">
            <div class="eb-wechoose-nav-button eb-wechoose-prev-button">
              <img src="https://cdn06.e-bebek.com/assets/svg/prev.svg" alt="Previous">
            </div>
            <div class="eb-wechoose-slider-container">
              <div class="eb-wechoose-banner-wrapper">
              </div>
            </div>
            <div class="eb-wechoose-nav-button eb-wechoose-next-button">
              <img src="https://cdn06.e-bebek.com/assets/svg/next.svg" alt="Next">
            </div>
          </div>
        </div>
      `;

      parent.appendChild(mainContainer);

      const productsWrapper = mainContainer.querySelector(
        ".eb-wechoose-banner-wrapper"
      );
      if (productsWrapper) {
        products.forEach((product) => {
          const oldPrice = parseFloat(product.original_price);
          const newPrice = parseFloat(product.price);

          let priceHTML = "";

          if (!isNaN(oldPrice) && !isNaN(newPrice) && oldPrice === newPrice) {
            priceHTML = `
              <span class="eb-wechoose-product-item-new-price">${newPrice
                .toFixed(2)
                .replace(".", ",")} TL</span>
            `;
          } else if (
            !isNaN(oldPrice) &&
            !isNaN(newPrice) &&
            oldPrice > newPrice
          ) {
            let discount = ((oldPrice - newPrice) / oldPrice) * 100;
            priceHTML = `
              <div class="eb-wechoose-product-item-price-discount-container">
              <span class="eb-wechoose-product-item-old-price">${oldPrice
                .toFixed(2)
                .replace(".", ",")} TL</span>
              <span class="eb-wechoose-product-item-percent">${discount.toFixed(
                0
              )}%
                 <i class="icon icon-decrease"></i>
              </div>
             <span class="eb-wechoose-product-item-new-price green">${newPrice
               .toFixed(2)
               .replace(".", ",")} TL</span>
            `;
          } else {
            priceHTML = `
              <span class="eb-wechoose-product-item-new-price">${newPrice
                .toFixed(2)
                .replace(".", ",")} TL</span>
            `;
          }

          const initialHeartSrc = favoriteProductIds.includes(
            String(product.id)
          )
            ? "https://www.e-bebek.com/assets/svg/added-favorite-hover.svg"
            : "https://www.e-bebek.com/assets/svg/default-favorite.svg";

          const productItemHTML = `
            <div class="eb-wechoose-owl-item">
              <div class="eb-wechoose-product-item">
                <div class="eb-wechoose-product-item-anchor">
                  <a href="${product.url || "#"}">
                    <figure class="eb-wechoose-product-item-image">
                    <img alt="Popular" loading="lazy" src="https://www.e-bebek.com/assets/images/cok-satan@2x.png" class="popular">
                      <cx-media alt="${
                        product.name || "Ürün Görseli"
                      }" format="product" class="is-initialized">
                        <img
                          class="ng-star-inserted lazyloaded"
                          alt="${product.name || "Ürün Görseli"}"
                          data-src="${
                            product.img || "some placeholder link if needed"
                          }"
                          src="${
                            product.img || "some placeholder link if needed"
                          }"
                        />
                      </cx-media>
                    </figure>
                    <div class="eb-wechoose-product-item-content">
                      <h2 class="eb-wechoose-product-item-brand">
                        <b> ${product.brand || ""} - </b><span> ${
            product.name || "No name for this product"
          } </span>
                      </h2>
                      <div class="d-flex mb-2 eb-wechoose-stars-wrapper align-items-center ng-star-inserted">
                        <cx-star-rating disabled="true" style="--star-fill: ${
                          product.rating || 0
                        }"
                        >${renderStars(product.rating || 0)}</cx-star-rating>
                        <p class="eb-wechoose-review-count ng-star-inserted">(${
                          product.reviewCount || 0
                        })</p>
                      </div>
                      <div class="eb-wechoose-product-item-price">
                          ${priceHTML}
                      </div>
                    </div>
                    <div class="eb-wechoose-product-list-promo"></div>
                    <div class="product-item-content">
                    <button type="submit" class="add-to-cart">Sepete Ekle</button>
                    </div>
                  </a>
                </div>
                <div class="heart-icon-product-item" data-product-id="${
                  product.id
                }">
                    <img class="heart-icon-img" src="${initialHeartSrc}" alt="heart">
                </div>
              </div>
            </div>
          `;
          productsWrapper.insertAdjacentHTML("beforeend", productItemHTML);
        });
      }
    };

    const renderStars = (rating) => {
      let starsHtml = "";
      for (let i = 0; i < 5; i++) {
        starsHtml += `<cx-icon class="star cx-icon fas fa-star ng-star-inserted"></cx-icon>`;
      }
      return starsHtml;
    };

    const setEvents = () => {
      const prevBtn = document.querySelector(".eb-wechoose-prev-button");
      const nextBtn = document.querySelector(".eb-wechoose-next-button");
      const heartIconContainers = document.querySelectorAll(
        ".heart-icon-product-item"
      );

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          currentIndex = Math.max(0, currentIndex - 1);
          updateSlider();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          const maxIndex = products.length - itemsToShow;
          currentIndex = Math.min(maxIndex, currentIndex + 1);
          updateSlider();
        });
      }

      heartIconContainers.forEach((container) => {
        const heartIconImg = container.querySelector(".heart-icon-img");
        const productId = container.dataset.productId;

        container.addEventListener("mouseover", () => {
          if (!favoriteProductIds.includes(productId)) {
            heartIconImg.src =
              "https://www.e-bebek.com/assets/svg/default-hover-favorite.svg";
          }
        });
        container.addEventListener("mouseout", () => {
          if (!favoriteProductIds.includes(productId)) {
            heartIconImg.src =
              "https://www.e-bebek.com/assets/svg/default-favorite.svg";
          } else {
            heartIconImg.src =
              "https://www.e-bebek.com/assets/svg/added-favorite-hover.svg";
          }
        });

        container.addEventListener("click", (event) => {
          event.stopPropagation();
          if (favoriteProductIds.includes(productId)) {
            favoriteProductIds = favoriteProductIds.filter(
              (id) => id !== productId
            );
            heartIconImg.src =
              "https://www.e-bebek.com/assets/svg/default-favorite.svg";
          } else {
            favoriteProductIds.push(productId);
            heartIconImg.src =
              "https://www.e-bebek.com/assets/svg/added-favorite-hover.svg";
          }
          localStorage.setItem(
            FAVORITE_LOCAL_STORAGE_KEY,
            JSON.stringify(favoriteProductIds)
          );
        });
      });
    };

    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        itemsToShow = 4;
      } else if (width >= 1180) {
        itemsToShow = 3;
      } else if (width > 992) {
        itemsToShow = 3;
      } else if (width > 576) {
        itemsToShow = 2;
      } else {
        itemsToShow = 2;
      }
      currentIndex = 0;
      updateSlider();
    };

    const updateSlider = () => {
      const productsWrapper = document.querySelector(
        ".eb-wechoose-banner-wrapper"
      );
      const prevBtn = document.querySelector(".eb-wechoose-prev-button");
      const nextBtn = document.querySelector(".eb-wechoose-next-button");
      const allItems = document.querySelectorAll(".eb-wechoose-owl-item");

      if (!productsWrapper || allItems.length === 0) return;

      const itemWidth = allItems[0].offsetWidth;
      const gap =
        window.innerWidth > 992 ? 20 : window.innerWidth > 576 ? 20 : 20;
      const translateValue = -currentIndex * (itemWidth + gap);

      productsWrapper.style.transform = `translateX(${translateValue}px)`;
    };

    const buildCSS = () => {
      const css = `
        #ebWeChooseForYouBanner {
          margin-top: 20px;
          margin-bottom: 20px;
        }
        #ebWeChooseForYouBanner .eb-wechoose-container {
          padding-right: 15px;
          padding-left: 15px;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          position: relative;
        }
        #ebWeChooseForYouBanner .eb-wechoose-banner-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #fef6eb;
          padding: 25px 67px;
          border-top-left-radius: 35px !important;
          border-top-right-radius: 35px !important;
          font-family: Quicksand-Bold, sans-serif;
          font-weight: 700;
        }
        #ebWeChooseForYouBanner .eb-wechoose-title-primary {
          font-family: Quicksand-Bold, sans-serif;
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.11;
          color: #f28e00;
          margin: 0;
        }

        #ebWeChooseForYouBanner .eb-wechoose-slider-main {
          position: relative;
        }
        #ebWeChooseForYouBanner .eb-wechoose-slider-container {
          overflow: hidden;
          box-shadow: 15px 15px 30px 0 #ebebeb80;
          background-color: #fff;
          border-bottom-left-radius: 35px !important;
          border-bottom-right-radius: 35px !important;
        }
        #ebWeChooseForYouBanner .eb-wechoose-banner-wrapper {
          display: flex;
          transition: transform 0.5s ease-in-out;
          padding: 20px 0px;
        }
        #ebWeChooseForYouBanner .eb-wechoose-owl-item {
          flex: 0 0 calc(25% - 15px);
          max-width: calc(25% - 15px);
          margin-right: 20px;
          box-sizing: border-box;
        }
        #ebWeChooseForYouBanner .eb-wechoose-owl-item:last-child {
          margin-right: 0;
        }

        @media (min-width: 993px) and (max-width: 1279px) {
          #ebWeChooseForYouBanner .eb-wechoose-owl-item {
            flex: 0 0 calc(33.33% - 13.33px);
            max-width: calc(33.33% - 13.33px);
          }
        }

        @media (max-width: 992px) {
          #ebWeChooseForYouBanner .eb-wechoose-owl-item {
            flex: 0 0 calc(50% - 10px);
            max-width: calc(50% - 10px);
          }
        }
        @media (max-width: 768px) {
          #ebWeChooseForYouBanner .eb-wechoose-container {
            max-width: 720px;
          }
        }

        @media (max-width: 576px) {
          #ebWeChooseForYouBanner .eb-wechoose-container {
            max-width: 100vw;
            padding-left: 15px;
            padding-right: 15px;
          }
          #ebWeChooseForYouBanner .eb-wechoose-owl-item {
            flex: 0 0 calc(50% - 10px);
            max-width: calc(50% - 10px);
            margin-right: 20px;
          }
        }

        #ebWeChooseForYouBanner .eb-wechoose-nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: #FEF6EB;
          border: 1px solid transparent;
          border-radius: 50% !important;
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          z-index: 10;
          transition: opacity 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
        }
        #ebWeChooseForYouBanner .eb-wechoose-prev-button {
          left: -65px;
        }
        #ebWeChooseForYouBanner .eb-wechoose-next-button {
          right: -65px;
        }
        #ebWeChooseForYouBanner .eb-wechoose-nav-button:hover {
          background-color: white;
          border: 1px solid #F18E03;
        }
        #ebWeChooseForYouBanner .eb-wechoose-nav-button img {
          width: 18px;
          height: 18px;
          transition: filter 0.3s ease;
        }

        #ebWeChooseForYouBanner .eb-wechoose-product-item:hover {
          box-shadow: 0 0 0 0 #00000030, inset 0 0 0 3px #f28e00;
          color: #7d7d7d;
          cursor: pointer;
          z-index: 2;
        }
        #ebWeChooseForYouBanner .eb-wechoose-product-item {
          margin-top: 20px;
          z-index: 1;
          display: block;
          width: 100%;
          font-family: Poppins, "cursive", sans-serif;
          font-size: 12px;
          padding: 5px;
          color: #7d7d7d;
          margin: 0;
          border: 1px solid #ededed;
          border-radius: 10px !important;
          position: relative;
          text-decoration: none;
          background-color: #fff;
          box-sizing: border-box;
        }
        #ebWeChooseForYouBanner .eb-wechoose-product-item-anchor {
          color: unset;
          background: unset;
          display: block;
        }
        #ebWeChooseForYouBanner .eb-wechoose-product-item-image {
          position: relative;
          display: block;
          width: 100%;
          background-color: #fff;
          margin-bottom: 45px !important;
          text-align: center;
          margin: 0 0 1rem;
        }
        #ebWeChooseForYouBanner cx-media {
          position: relative;
          display: block;
        }
        #ebWeChooseForYouBanner cx-media img {
          display: block;
          width: 100% !important;
          max-height: 100%;
          max-width: 100% !important;
          width: auto;
          height: 203px;
          object-fit: contain;
          opacity: 1;
          transition: all 0.6s;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        #ebWeChooseForYouBanner .eb-wechoose-product-item-content {
          padding: 0 17px 17px;
          padding-bottom: 13px;
        }
        #ebWeChooseForYouBanner .eb-wechoose-product-item-brand {
          font-size: 1.2rem;
          height: 42px;
          overflow: hidden;
          margin-bottom: 10px;
          color: #7d7d7d;
          line-height: 1.2222222222;
        }
        #ebWeChooseForYouBanner .eb-wechoose-stars-wrapper {
          --cx-color-primary: #fed100;
          --cx-color-light: #d7d7d7;
          padding: 5px 0 15px;
          display: flex;
          align-items: center;
        }
        #ebWeChooseForYouBanner .eb-wechoose-stars-wrapper cx-icon {
          color: var(--cx-color-primary);
        }
        #ebWeChooseForYouBanner .eb-wechoose-stars-wrapper .eb-wechoose-review-count {
          margin-left: 5px;
          font-size: 0.9em;
          color: #7d7d7d;
          margin-bottom: 0 !important;
        }
        #ebWeChooseForYouBanner .eb-wechoose-product-item-price {
          position: relative;
          display: flex;
          flex-direction: column;

          height: 43px;
          justify-content: flex-end;
        }
        #ebWeChooseForYouBanner .eb-wechoose-product-item__old-price {
          text-decoration: line-through;
          color: #999;
          font-size: 1rem;
          margin-right: 5px;
        }
        #ebWeChooseForYouBanner .eb-wechoose-product-item__percent {
          background-color: #f28e00;
          color: #fff;
          padding: 2px 5px;
          border-radius: 3px;
          font-size: 0.9rem;
        }
        #ebWeChooseForYouBanner .eb-wechoose-product-item__new-price.eb-wechoose-discount-product {
          color: #00a365;
          font-weight: bold;
          font-size: 1.3rem;
        }
        #ebWeChooseForYouBanner .eb-wechoose-product-list-promo {
          min-height: 50px;
          padding-left: 7.5px;
        }
          #ebWeChooseForYouBanner .add-to-cart {
              position: relative;
              width: 100%;
              padding: 15px 20px;
              border-radius: 37.5px;
              background-color: #fff7ec;
              color: #f28e00;
              font-family: Poppins, "cursive";
              font-size: 1.4rem;
              font-weight: 700;
              z-index: 2;
              transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
          }
              #ebWeChooseForYouBanner .add-to-cart:hover {
                  background-color: #f28e00;
                  color: #fff;
              }

          #ebWeChooseForYouBanner .eb-wechoose-product-item-new-price {
          display: block;
          width: 100%;
          font-size: 2.2rem;
          font-weight: 600;
          color: #7D7D7D;
          }
          #ebWeChooseForYouBanner .green {
              color: #00a365;
          }
          #ebWeChooseForYouBanner .eb-wechoose-product-item-price-discount-container {
          display: flex;
          flex-direction: row;
          align-items: center;

          }
          #ebWeChooseForYouBanner .eb-wechoose-product-item-old-price {
          text-decoration: line-through;
          font-weight: 500;
          font-size: 1.4rem;
          color: #7d7d7d;
          }
          #ebWeChooseForYouBanner .eb-wechoose-product-item-percent {
              color: #00a365;
              font-size: 18px;
              font-weight: 700;
              display: inline-flex;
              justify-content: center;
              margin-left: 10px !important;

          }
          #ebWeChooseForYouBanner .eb-wechoose-product-item-price-discount-container .icon {
                 display: inline-block;
                  height: 22px;
                  font-size: 22px;
                  margin-left: 3px;
                    color: #00a365;
          }

          #ebWeChooseForYouBanner .popular {
          position: absolute;
          left: 13px;
          top: 5px;
          z-index: 2;
          width: 56px !important;;
          }
          #ebWeChooseForYouBanner .heart-icon-product-item {
          position: absolute;
          right: 15px;
          top: 10px;
          cursor: pointer;
          background-color: #fff;
          border-radius: 50% !important;
          display:flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px 0 #00000024;
          width: 50px;
          height: 50px;
          z-index: 3;
      `;

      const style = document.createElement("style");
      style.className = "gonul-meliha-manav-style";
      style.textContent = css;
      document.head.appendChild(style);
    };

    init();
  })();
} else {
  console.log("wrong page");
}
