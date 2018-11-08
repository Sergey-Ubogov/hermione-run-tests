[].forEach.call(document.getElementsByClassName('image-box__screenshot'), elem => {
    elem.src = elem.src.replace(/%5C/g, '/');
});
