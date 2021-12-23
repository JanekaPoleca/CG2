import * as twgl from '../lib/twgl-full'
import Universe from './visualObjects/universe'
import Planet from './visualObjects/planet'

const {m4} = twgl


const initwebgl = () => {
    const gl = document.querySelector("canvas").getContext("webgl")
    if (!gl) {
        throw 'webgl not supported'
    }

    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)

    return gl
}

const main = () => {

    const gl = initwebgl()
    
    let universe = new Universe(gl)

    let star = new Planet(gl, 27, './res/sun.jpg', universe, true)

    
    let p1 = new Planet(gl, 15, './res/mars.jpg', universe)
    p1.addTransform( m4.translation([70, 0, 0]) )
    p1.addTimeTransform( t => m4.rotationZ(0.0008 * t) )

    let p2 = new Planet(gl, 3, '/res/earth.jpg', universe)
    p2.addTimeTransform( t => m4.rotationZ(0.025 *t), true)
    p2.addTransform( m4.translation([42,0,0]))
    p2.addTimeTransform( t => m4.rotationZ(0.012 *t))

    let p3 = new Planet(gl, 7, '/res/clouds.jpg', universe)
    p3.addTimeTransform( t => m4.rotationZ(0.02 *t), true)
    p3.addTransform( m4.translation([72,0,0]))
    p3.addTimeTransform( t => m4.rotationZ(0.007 *t))

    let p4 = new Planet(gl, 12, '/res/moon.jpg', universe)
    p4.addTimeTransform( t => m4.rotationZ(0.1 *t), true)
    p4.addTransform( m4.translation([102,0,0]))
    p4.addTimeTransform( t => m4.rotationZ(0.005 *t))

    let p5 = new Planet(gl, 10, '/res/jupiter.jpg', universe)
    p5.addTimeTransform( t => m4.rotationZ(0.001 *t), true)
    p5.addTransform( m4.translation([150,0,0]))
    p5.addTimeTransform( t => m4.rotationZ(0.011 *t))

    let s2 = new Planet(gl, 2, '/res/ceres_fictional.jpg', p5)
    s2.addTimeTransform( t => m4.rotationZ(0.1 *t) , true)
    s2.addTransform( m4.translation([13,0,0]))
    s2.addTimeTransform( t => m4.rotationZ(0.1 *t))

    let s3 = new Planet(gl, 4, '/res/saturn.jpg', p5)
    s3.addTimeTransform( t => m4.rotationZ(0.05 *t), true)
    s3.addTransform( m4.translation([25,0,0]))
    s3.addTimeTransform( t => m4.rotationZ(0.07 *t))

    let s4 = new Planet(gl, 1, '/res/uranus.jpg', s3)
    s4.addTimeTransform( t => m4.rotationZ(0.5 *t), true)
    s4.addTransform( m4.translation([6,0,0]))
    s4.addTimeTransform( t => m4.rotationZ(0.5 *t))

    let p6 = new Planet(gl, 20, '/res/jupiter.jpg', universe)
    p6.addTimeTransform( t => m4.rotationZ(0.002 *t), true)
    p6.addTransform( m4.translation([210,0,0]))
    p6.addTimeTransform( t => m4.rotationZ(0.002 *t))

    let planets =  [universe, star, p1, p2, p3, p4, p5, s2, s3, s4, p6]

    const render = time => {
        planets.forEach(p => p.update(time))

        let lastType = null
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