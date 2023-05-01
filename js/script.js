// eslint-disable-next-line import/extensions
import keysLayout from './keys.js';

const Keyboard = {
  elements: {
    main: null,
    keys: [],
    area: null,
  },

  properties: {
    language: 'eng',
    value: '',
    capsLock: false,
    shift: false,
    selectionStart: 0,
    selectionEnd: 0,
  },

  init() {
    // Create main element
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('keyboard');
    this.elements.main.id = 'keyboard';
    this.elements.main.innerHTML = this.createKeys();

    // Add to DOM
    if (document.getElementById('keyboard')) {
      document.getElementById('keyboard').remove();
    }
    document.body.append(this.elements.main);
    this.elements.keys = this.elements.main.querySelectorAll('.key');
    this.addKeysEvents();
  },

  createKeys() {
    let fragment = '';
    keysLayout.forEach((element) => {
      fragment += '<div class="keyboard__row">';
      element.forEach((key) => {
        if (key.size) {
          fragment += `<div data-key-code="${key.code}" style="--key-size: ${key.size}" data-key-display="${key.key}" class="key">${key.key}</div>`;
        } else if (this.properties.language === 'eng') {
          fragment += `<div data-key-code="${key.code}" data-key-display="${key.key}" class="key key__transformable">${key.key}</div>`;
        } else if (this.properties.language === 'rus') {
          fragment += `<div data-key-code="${key.code}" data-key-display="${key.keyRu}" class="key key__transformable">${key.keyRu}</div>`;
        }
      });
      fragment += '</div>';
    });
    return fragment;
  },

  initTextArea() {
    const area = `<div class="textarea">
                      <textarea class="textarea-input"></textarea>
                  </div>`;
    document.body.insertAdjacentHTML('beforeend', area);
    this.elements.area = document.querySelector('.textarea-input');
    this.elements.area.addEventListener('select', () => {
      this.detectSelection();
    });
  },

  addKeysEvents() {
    this.elements.keys.forEach((key) => {
      switch (key.textContent) {
        case 'Backspace':
          key.addEventListener('click', () => {
            const borders = this.detectSelection();
            const start = borders[0] >= 1 ? borders[0] : 1;
            if (borders[0] === borders[1]) {
              this.properties.value = this.properties.value.substring(0, borders[0] - 1)
                + this.properties.value.substring(borders[0], this.properties.value.length);
              this.properties.selectionStart = start - 1;
            } else {
              this.properties.value = this.properties.value.substring(0, borders[0])
                + this.properties.value.substring(borders[1], this.properties.value.length);
              this.properties.selectionStart = start;
            }
          });

          break;

        case 'Caps':
          key.addEventListener('click', () => {
            this.toggleCapsLock();
            key.classList.toggle('key--toggled', this.properties.capsLock);
          });

          break;

        case 'Enter':
          key.addEventListener('click', () => {
            const start = this.detectSelection()[0];
            this.properties.value = [this.properties.value.slice(0, start),
              '\n', this.properties.value.slice(start)].join('');
            this.properties.selectionStart = start + 1;
          });

          break;

        case 'Space':
          key.addEventListener('click', () => {
            const start = this.detectSelection()[0];
            this.properties.value = [this.properties.value.slice(0, start),
              ' ', this.properties.value.slice(start)].join('');
            this.properties.selectionStart = start + 1;
          });

          break;

        case 'Shift':
          key.addEventListener('mousedown', () => {
            this.properties.shift = true;
            this.toggleUpperCase();
          });
          key.addEventListener('mouseup', () => {
            this.properties.shift = false;
            this.toggleUpperCase();
          });

          break;

        case 'Del':
          key.addEventListener('click', () => {
            const borders = this.detectSelection();
            const start = borders[0];
            if (borders[0] === borders[1]) {
              this.properties.value = this.properties.value.substring(0, borders[0])
                + this.properties.value.substring(borders[0] + 1, this.properties.value.length);
              this.properties.selectionStart = start;
            } else {
              this.properties.value = this.properties.value.substring(0, borders[0])
                + this.properties.value.substring(borders[1], this.properties.value.length);
              this.elements.area.selectionStart = start;
            }
          });
          break;
        case 'Tab':
          key.addEventListener('click', () => {
            const start = this.detectSelection()[0];
            this.properties.value = [this.properties.value.slice(0, start),
              '\t', this.properties.value.slice(start)].join('');
            this.properties.selectionStart = start + 1;
          });
          break;
        case 'Alt':
          //
          break;
        case 'Ctrl':
          //
          break;
        case 'Win':
          //
          break;
        default:
          key.addEventListener('mousedown', () => {
            const start = this.detectSelection()[0];
            this.properties.value = [this.properties.value.slice(0, start), this.properties.capsLock
              ? key.textContent.toUpperCase() : key.textContent.toLowerCase(),
            this.properties.value.slice(start)].join('');
            this.properties.selectionStart = start + 1;
          });

          break;
      }
      key.addEventListener('mousedown', () => {
        key.classList.add('active');
      });
      key.addEventListener('mouseup', () => {
        key.classList.remove('active');
      });
      key.addEventListener('click', () => {
        this.elements.area.textContent = this.properties.value;
        this.elements.area.focus();
        this.elements.area.selectionStart = this.properties.selectionStart;
      });
    });
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    this.toggleUpperCase();
  },

  toggleUpperCase() {
    document.querySelectorAll('.key__transformable').forEach((key) => {
      key.classList.toggle('key__upperCase');
    });
  },

  detectSelection() {
    console.log(this.properties.selectionStart, this.properties.selectionEnd);
    console.log(this.elements.area.selectionStart, this.elements.area.selectionEnd);
    return [this.elements.area.selectionStart, this.elements.area.selectionEnd];
  },
};

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.initTextArea();
  Keyboard.init();
});

window.onkeydown = (e) => {
  document.querySelector(`[data-key-code="${e.code}"]`).classList.add('active');
};

window.onkeyup = (e) => {
  document.querySelector(`[data-key-code="${e.code}"]`).classList.remove('active');
};
