import * as twgl from '../lib/twgl-full'
import Sphere from './visualObjects/sphere'
import Universe from './visualObjects/universe'

const {m4} = twgl


let initwebgl = () => {
    const gl = document.querySelector("canvas").getContext("webgl")
    if (!gl) {
        throw 'webgl not supported'
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    return gl
}

let main = () => {

    const gl = initwebgl()
    
    let universe = new Universe(gl);
    let star = new Sphere(gl, 20, 70, universe);
    
    let p1 = new Sphere(gl, 5, 20, universe);
    p1.addRotationZ(0.03);
    p1.addTranslation(30,0,0);
    p1.addRotationZ(0.04);

    let p2 = new Sphere(gl, 3, 20, universe);
    p2.addRotationZ(0.035);
    p2.addTranslation(42,0,0);
    p2.addRotationZ(0.01);

    let p3 = new Sphere(gl, 7, 25, universe);
    p3.addRotationZ(0.02);
    p3.addTranslation(72,0,0);
    p3.addRotationZ(0.007);

    let m1 = new Sphere(gl, 2, 10, p3);
    m1.addRotationZ(0.04);
    m1.addTranslation(12,0,0);
    m1.addRotationZ(0.06);
    
    let p4 = new Sphere(gl, 12, 25, universe);
    p4.addRotationZ(0.1);
    p4.addTranslation(102,0,0);
    p4.addRotationZ(0.005);

    let p5 = new Sphere(gl, 10, 25, universe);
    p5.addRotationZ(0.001);
    p5.addTranslation(150,0,0);
    p5.addRotationZ(0.012);

    let m2 = new Sphere(gl, 2, 10, p5);
    m2.addRotationZ(0.1);
    m2.addTranslation(13,0,0);
    m2.addRotationZ(0.1);

    let m3 = new Sphere(gl, 4, 20, p5);
    m3.addRotationZ(0.2);
    m3.addTranslation(25,0,0);
    m3.addRotationZ(0.07);

    let m4 = new Sphere(gl, 1, 8, m3);
    m4.addRotationZ(0.5);
    m4.addTranslation(6,0,0);
    m4.addRotationZ(0.5);

    let p6 = new Sphere(gl, 20, 25, universe);
    p6.addRotationZ(0.002);
    p6.addTranslation(210,0,0);
    p6.addRotationZ(0.002);

    let planets = [star, p1, p2, p3, m1, p4, p5, m2, m3, m4, p6];



    const update = time => {
        universe.update(time)
        planets.forEach(p => p.update(time))
    }

    const render = time => {
        update(time)
        universe.render(gl, time)
        planets.forEach(p => p.render(gl, time))
        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}


window.onload = main