#version 330

#define MAX_STEPS 200
#define MAX_DIST 300.
#define SURF_DIST .001

in vec2 fragCoord;
out vec4 fragColor;

uniform vec2 iResolution;
uniform float time;
/*
Box raymarching shader
Test
*/
float sdBox(vec3 p, vec3 s) {
    p = abs(p)-s;
	return length(max(p, 0.))+min(max(p.x, max(p.y, p.z)), 0.);
}
float GetDist(vec3 p) {
    float box = sdBox(p-vec3(0,0,0), vec3(1));
   
    
    float d = min(0.05, box);
    return d;
}

float RayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = ro + rd*dO;
        float dS = GetDist(p);
        dO += dS;
        if(dO>MAX_DIST || dS<SURF_DIST) break;
    }
    
    return dO;
}
vec3 R(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = p+f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i-p);
    return d;
}
void main()
{
    vec2 uv = (gl_FragCoord.xy-.5*iResolution.xy)/iResolution.y;
    vec3 ro = vec3(cos(time*0.1)*5,0,sin(time*0.1)*5);
    vec3 rd = R(uv, ro, vec3(sin(cos(time * 0.5)),0,0), 1.);
    vec3 col = vec3(0.,0.,0.);
    float d = RayMarch(ro,rd);
    if(d<MAX_DIST) {
    	vec3 p = ro + rd * d;
    
    	
    	col = vec3((d*d*d*d),(d*d*d*d),(d*d*d*d));
    }
    col = pow(col, vec3(-.3));
    // Output to screen
    fragColor = vec4(col,1.0);
}