import * as twgl from '../lib/twgl-full'
import Universe from './visualObjects/universe'
import Planet from './visualObjects/planet'
import Star from './visualObjects/star'
import Satellite from './visualObjects/satellite'
import Torus from './visualObjects/torus'

const {m4} = twgl


const initwebgl = () => {
    const gl = document.querySelector("canvas").getContext("webgl")
    if (!gl) {
        throw 'webgl not supported'
    }

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    return gl
}

const main = () => {

    const gl = initwebgl()
    
    let universe = new Universe(gl)

    let sun = new Planet(gl, 40, './res/sun.jpg', universe);

    sun.addTimeTransform( t => m4.rotationZ(-0.01 * t) )
    sun.addTransform( m4.translation([200, 0, 0]) )
    sun.addTimeTransform( t => m4.rotationZ(0.0005 * t) )

    
    let p1 = new Planet(gl, 20, './res/mars.jpg', sun);
    p1.addTransform( m4.translation([70, 0, 0]) );
    p1.addTimeTransform( t => m4.rotationZ(0.0008 * t) )

    /*
    let p2 = new Planet(gl, 30, 20, 20, .06, './res/jupiter.jpg', universe);
    p2.addTranslation(150,0,0);

    let p3 = new Planet(gl, 10, 20, 10, 0.1, './res/clouds.jpg', universe);
    p3.addTranslation(30,0,0);

    let p2 = new Planet(gl, 3, 20, universe);
    p2.addRotationZ(0.025);
    p2.addTranslation(42,0,0);
    p2.addRotationZ(0.012);

    let p3 = new Planet(gl, 7, 25, universe);
    p3.addRotationZ(0.02);
    p3.addTranslation(72,0,0);
    p3.addRotationZ(0.007);
    let s1 = new Satellite(gl, 5, 10, 0.04, 0.06, '/res/earth.jpg', p1);
    //s1.addRotationZ(0.04);
    s1.addTranslation(20,0,0);
    //s1.addRotationZ(0.06);

    let p4 = new Planet(gl, 12, 25, universe);
    p4.addRotationZ(0.1);
    p4.addTranslation(102,0,0);
    p4.addRotationZ(0.005);

    let p5 = new Planet(gl, 10, 25, universe);
    p5.addRotationZ(0.001);
    p5.addTranslation(150,0,0);
    p5.addRotationZ(0.011);

    let s2 = new Planet(gl, 2, 10, p5);
    s2.addRotationZ(0.1);
    s2.addTranslation(13,0,0);
    s2.addRotationZ(0.1);

    let s3 = new Planet(gl, 4, 20, p5);
    s3.addRotationZ(0.05);
    s3.addTranslation(25,0,0);
    s3.addRotationZ(0.07);

    let s4 = new Planet(gl, 1, 8, s3);
    s4.addRotationZ(0.5);
    s4.addTranslation(6,0,0);
    s4.addRotationZ(0.5);

    let p6 = new Planet(gl, 20, 25, universe);
    p6.addRotationZ(0.002);
    p6.addTranslation(210,0,0);
    p6.addRotationZ(0.002);

    let r1 = new Torus(gl, 25, 3, 20, 20, p6);
    r1.addRotationX(70, true);
    r1.addRotationZ(0.01);

    let c1 = new Planet(gl, 2, 10, universe);
    c1.addTranslation(100, 0, 0);
    c1.addEllipseZ(160, 60, -0.0004);

    let planets =  [universe, star, p1, p2, p3, s1, p4, p5, s2, s3, s4, p6, r1, c1];
    */

    let planets = [universe, sun, p1];

    const render = time => {
        planets.forEach(p => p.update(time))

        let lastType = null;
        planets.forEach( p => {
            p.render(gl, lastType !== p.constructor.name)
            lastType = p.constructor.name
        })
        planets.forEach(p => p.render(gl, time))
        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}


window.onload = main