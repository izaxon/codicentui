// codicent-script.js
document.addEventListener('DOMContentLoaded', () => {
   setTimeout(() => {
      window.Codicent.init({
         token: '',
         signalRHost: "https://codicent-prod-pubsub.azurewebsites.net/hub",
      });

      const fetchMessageCount = async (tag, element) => {
         try {
            const codicent = window.Codicent
            const messages = await codicent.getMessages({ search: "#" + tag });
            const numberElement = element.querySelector(`.number`);
            // const labelElement = element.querySelector(`.label`);
            numberElement.textContent = messages.length;
         } catch (error) {
            console.error('Error fetching messages:', error);
         }
      };

      const renderCodicentMessageCount = (element, index) => {
         const tag = element.getAttribute('data-tag');
         const label = element.getAttribute('data-label');
         const componentHTML = `
         <div class="codicent-message-count">
           <span class="number">0</span>
           <span class="label">${label || ""}</span>
         </div>
       `;
         const id = element.getAttribute('id');
         element.innerHTML = componentHTML;
         element.setAttribute('id', id || "codicent-message-count-" + index);
         fetchMessageCount(tag, element);
      };

      const renderComponent = (element, index) => {
         const componentType = element.getAttribute('data-component-type');
         const tag = element.getAttribute('data-tag') || 'important';

         if (componentType.startsWith('codicent-')) {
            switch (componentType) {
               case 'codicent-message-count':
                  renderCodicentMessageCount(element, index);
                  break;
               // TODO: add more cases here for different component types
               // const functionName = "renderCodicentMyFunc";
               // if (typeof window[functionName] === "function") {
               //    window[functionName](); // Calls CodicentExample()
               //    OR: window.Codicent.components[functionName]();
               //  } else {
               //    console.error(`Function ${functionName} does not exist`);
               //  }
               default:
                  console.warn(`Unknown component type: ${componentType}`);
            }
         }
      };

      document.querySelectorAll('[data-component-type]').forEach((element, index) => {
         renderComponent(element, index);
      });

      // Update the message count when the button is clicked
      const tagInput = document.getElementById('codicent-tag-input');
      const updateTagButton = document.getElementById('codicent-update-tag');
      updateTagButton.addEventListener('click', () => {
         const tag = tagInput.value.trim();
         if (tag) {
            const element = document.getElementById('num');
            fetchMessageCount(tag, element);
         }
      });
   }, 1000);
});