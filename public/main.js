const gl = document.querySelector('canvas').getContext('webgl');

if(!gl) {
    throw new Error('WebGL not supported');
}

