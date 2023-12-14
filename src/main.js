import './style.css'
import defaultPalettes from './palettes.json'
import {setPalette, removeDefaultPalettesLS, getPalettes } from  './localStorage'
import { v4 as uuidv4 } from 'uuid';


const handlePaletteSubmit = (e) => {
  e.preventDefault();
  const  formData = new FormData(e.target);
  const colors = document.getElementsByName('colors');
  
  const colorArray = [];
  for (let i = 0; i < colors.length; i++) {
    colorArray.push(colors[i].value);
  };
  const paletteData = {};
  formData.forEach((value, key) => {
    paletteData[key] = value;
  });
  paletteData.colors = colorArray;
  removeDefaultPalettes();
  removeDefaultPalettesLS();
  setPalette(uuidv4(), paletteData);
  addPalette('custom-palette', paletteData);
  document.querySelector('#palette-form').reset();
};

const handleDeletePalette = (deleteButton) => {
  const listItem = deleteButton.closest('.list-item');
  if (listItem) {
    listItem.remove();
  }
  const palettes = JSON.parse(localStorage.getItem('palettes')) || [];
  const updatedPalettes = palettes.filter(palette => palette.title !== listItem.textContent.trim());
  localStorage.setItem('palettes', JSON.stringify(updatedPalettes));
};

const handleCopy = () => {
  const copyButtons = document.querySelectorAll('.copy-button');
  copyButtons.forEach(button => {
    button.addEventListener('click', (() => {
      const buttonText = button.textContent;
      const hexCode = extractHexCode(buttonText);
      navigator.clipboard.writeText(hexCode)
        .then(() => {
          const originalText = buttonText;
          button.textContent = 'Copied hex!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 1000);
          console.log('Hex code copied to clipboard:', hexCode);
        })
        .catch(err => {
          console.error('Unable to copy hex code to clipboard:', err);
        });
    }).bind(button)); 
  });
};

const extractHexCode = (text) => {
  const match = text.match(/#([0-9a-fA-F]{6})/);
  return match ? `#${match[1]}` : '';
}

const addPalette = (className, palette) => {
  console.log(palette)
  document.querySelector('#palette-list').innerHTML += `<li class="${className} list-item">
  <div>
    <h3>${palette.title}</h3>
    <div class="text-button">
      <p>
        <span class="white">Text</span>
        <span class="black">Example</span>
      </p>
      <button class="copy-button">Copy ${palette.colors[0]}</button>
    </div>
    <div class="text-button">
      <p>
        <span class="white">Text</span>
        <span class="black">Example</span>
      </p>
      <button class="copy-button">Copy ${palette.colors[1]}</button>
    </div>
    <div class="text-button">
      <p>
        <span class="white">Text</span>
        <span class="black">Example</span>
      </p>
      <button class="copy-button">Copy ${palette.colors[2]}</button>
    </div>
    <button class=delete-button>Delete Palette</button>
    <p class="palette-temp">${palette.temperature}</p>
  </div>
</li>`;
handleCopy();
}

const removeDefaultPalettes = () => {
  document.querySelectorAll('.default-palette').forEach((el) =>{
    el.remove()
  })
}


const loadDefaultPalettes = () => {
  defaultPalettes.forEach((palette, index) => {
    setPalette(`defaultPalette-${index}`, palette)
    addPalette('default-palette', palette)
    handleCopy();
   })  
}

const loadPalettes = () => {
  const palettes = getPalettes();
  if(Object.keys(palettes).length > 0) {
    for(const key in palettes) {
      handleCopy();
      if(key.startsWith('defaultPalette')) {
        addPalette('default-palette', JSON.parse(palettes[key]));
      } else {
        addPalette('custom-palette', JSON.parse(palettes[key]));
      }
    }
  } else {
    loadDefaultPalettes();
  }
}

const main = () => {
  document.querySelector('#palette-form').addEventListener('submit', handlePaletteSubmit);
  loadPalettes();
  const listItems = document.getElementsByClassName('list-item');
  for (const item of listItems) {
    const deleteButton = item.querySelector('.delete-button');
    deleteButton.addEventListener('click', (e) => handleDeletePalette(e.currentTarget));
  }
  
};
main();