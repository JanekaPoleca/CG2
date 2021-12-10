const {m4} = twgl

initwebgl = () => {
    const gl = document.querySelector("canvas").getContext("webgl")
    if (!gl) {
        throw 'webgl not supported'
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    return gl
}

main = () => {
    const gl = initwebgl()
    
    let universe = new Universe(gl);
    let planets = [];
    let p1 = new Sphere(gl, 3, 25, universe);
    p1.addRotationZ(0.005);
    p1.addTranslation(10,0,0);
    p1.addRotationZ(0.01);
    planets.push(p1);


    let m1 = new Sphere(gl, 1, 20, p1);
    m1.addTranslation(5,0,0);
    m1.addRotationZ(.07);
    planets.push(m1);

    let p3 = new Sphere(gl, 1, 20, universe);

    planets.push(p3);

    update = time => {
        universe.update(time)
        planets.forEach(p => p.update(time))
    }

    render = time => {
        update(time)
        universe.render(gl, time)
        planets.forEach(p => p.render(gl, time))
        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}


window.onload = main