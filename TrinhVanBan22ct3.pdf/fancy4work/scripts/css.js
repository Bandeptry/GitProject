let spinner_css = `
.loader {
    width: 16px;
    height: 16px;
    position: relative;
    left: -32px;
    border-radius: 50%;
    color: #fff;
    box-shadow: 32px 0 , -32px 0 ,  64px 0;
  }
  
  .loader::after {
    content: '';
    position: absolute;
    left: -32px;
    top: 0;
    width: 16px;
    height: 16px;
    border-radius: 10px;
    background:#000;
    animation: move 3s linear infinite alternate;
  }
  
  @keyframes move {
    0% , 5%{
      left: -32px;
      width: 16px;
    }
    15% , 20%{
      left: -32px;
      width: 48px;
    }
    30% , 35%{
      left: 0px;
      width: 16px;
    }
    45% , 50%{
      left: 0px;
      width: 48px;
    }
    60% , 65%{
      left: 32px;
      width: 16px;
    }
  
    75% , 80% {
      left: 32px;
      width: 48px;
    }
    95%, 100% {
      left: 64px;
      width: 16px;
    }
  }
`;

let collage_css = `
.awp-collage {
  width: 1200px;
  height: 630px;
  overflow: hidden;
  position: absolute;
  top: -1200px;
  left: -1200px;
  box-sizing: border-box;
  background-color: white;

}
.awp-collage.awp-ads {
  width: 1080px;
  height: 1080px;
  
}

.awp-collage .awp-more {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center !important;
  align-items: center !important;
  font-size: 100px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight:700;
  color: #f8fafc;
}
.awp-brick {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  flex-grow: 0;
  position: absolute;
}

.awp-collage > .awp-brick:nth-child(1) {
  width: 614px;
  height: 614px;
  top: 8px;
  left: 8px;
}
.awp-collage > .awp-brick:nth-child(2) {
  width: 562px;
  height: 303px;
  right: 8px;
  top: 8px;
}

.awp-collage > .awp-brick:nth-child(3) {
  width: 562px;
  height: 303px;
  right: 8px;
  bottom: 8px;
}
.awp-collage > .awp-brick:nth-child(4) {
  display: none;
}
.awp-collage > .awp-more {
  width: 562px;
  height: 303px;
  right:8px;
  bottom: 8px;
}

.awp-collage.awp-ads > .awp-brick:nth-child(1) {
  width: 1064px;
  height: 707px;
  inset: unset;
  top: 8px;
  left: 8px;
}
.awp-collage.awp-ads > .awp-brick:nth-child(2) {
  width: 349.3px;
  height: 349.3px;
  inset: unset;
  left: 8px;
  bottom: 8px;
}

.awp-collage.awp-ads > .awp-brick:nth-child(3) {
  width: 349.3px;
  height: 349.3px;
  inset: unset;
  bottom: 8px;
  left: 365.3px;
}
.awp-collage.awp-ads > .awp-brick:nth-child(4) {
  display: block;
  width: 349.3px;
  height: 349.3px;
  inset: unset;
  right: 8px;
  bottom: 8px;
}

.awp-collage.awp-ads > .awp-more {
  width: 350px;
  height: 350px;
}

#auto-wp-ui #post-content p, #auto-wp-ui #post-content h1, #auto-wp-ui #post-content h2, #auto-wp-ui #post-content h3 {
    margin-top: 10px;
    margin-bottom: 10px;
}

#auto-wp-ui #post-content h1, #auto-wp-ui #post-content h2, #auto-wp-ui #post-content h3 {
    font-size: larger;
}

`;


let css = `<style id="auto-wp-style">
${tailwind_css}


${spinner_css}


input[type="radio"] {
  appearance: none;

  border-radius: 50%;
  width: 16px;
  height: 16px;

  border: 2px solid black;
  transition: 0.2s all linear;
  margin-right: 5px;

  position: relative;
  top: 4px;
}

input[type="radio"]:checked {
  border: 6px solid black;
}

button:disabled, input:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

h1, h2, h3, h4, h5, h6 {
  font-size: larger;
  font-weight: bold;
}

blockquote {
  color: gray;
  margin: 10px;
  font-size: large;
}
ul, ol {
  list-style: unset;
}
ul li, ol li {
  margin-left: 20px;
}

</style>`;

