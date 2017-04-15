/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateX = function(out, a, b, c){
   var p = [], r=[];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
	  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

  	return out;
};

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateY = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  	r[1] = p[1];
  	r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
vec3.rotateZ = function(out, a, b, c){
  	var p = [], r=[];
  	//Translate point to the origin
  	p[0] = a[0] - b[0];
  	p[1] = a[1] - b[1];
  	p[2] = a[2] - b[2];
  
  	//perform rotation
  	r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  	r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  	r[2] = p[2];
  
  	//translate to correct position
  	out[0] = r[0] + b[0];
  	out[1] = r[1] + b[1];
  	out[2] = r[2] + b[2];
  
  	return out;
};


class RotatingCubeFriend extends Cube {
	constructor() {
		super(...arguments);
		this.previousRotation=[0,0,0];
		this.midRotation=false;
	}

	mouseInside(ev) {
		var p=[
			(ev.clientX-gl.canvas.offsetLeft)-(gl.canvas.width/2)-this.position[0],
			(ev.clientY-gl.canvas.offsetTop)-(gl.canvas.height/2)+this.position[1],
			0-this.position[2]
		];
		var o=[0,0,0];
		vec3.rotateX(p,p,o,-this.rotation[0]);
		vec3.rotateY(p,p,o,-this.rotation[1]);
		vec3.rotateZ(p,p,o,-this.rotation[2]);
		if(Math.abs(p[0])<this.scale[0]/2 && Math.abs(p[1])<this.scale[1]/2  && Math.abs(p[2])<this.scale[2]/2 ) {
			return true;
		} else {
			return false;
		}
	}

	rotateEvent(ev) {
		var mouseXpc=(ev.clientX-gl.canvas.offsetLeft)/(gl.canvas.width/2)-1;
		var mouseYpc=(ev.clientY-gl.canvas.offsetTop)/(gl.canvas.height/2)-1;

		if(!this.midRotation) {
			this.midRotation=true;
			this.previousRotation=[...this.rotation];
			this.rotation[1]+=Math.PI*mouseXpc;
			this.rotation[0]+=Math.PI*mouseYpc;
		} else {
			this.rotation=[...this.previousRotation];
			this.rotation[1]+=Math.PI*mouseXpc;
			this.rotation[0]+=Math.PI*mouseYpc;
		}
	}
}

class InsideMarker extends Sphere {
	moveEvent(ev) {
		var mouseX=ev.clientX-gl.canvas.offsetLeft-gl.canvas.width/2-this.parent.position[0];
		var mouseY=ev.clientY-gl.canvas.offsetTop-gl.canvas.height/2+this.parent.position[1];
		
		var X=mouseX//pc*(this.parent.scale[0]-this.scale[0])/2;
		var Y=-mouseY//pc*(this.parent.scale[1]-this.scale[1])/2;
		var Z=0;

		var p=[X,Y,Z];
		var o=[0,0,0];
		vec3.rotateX(p,p,o,-this.parent.rotation[0]);
		vec3.rotateY(p,p,o,-this.parent.rotation[1]);
		vec3.rotateZ(p,p,o,-this.parent.rotation[2]);

		p[0]=Math.min(Math.max(-this.parent.scale[0]*0.5,p[0]),this.parent.scale[0]*0.5);
		p[1]=Math.min(Math.max(-this.parent.scale[1]*0.5,p[1]),this.parent.scale[1]*0.5);
		p[2]=Math.min(Math.max(-this.parent.scale[2]*0.5,p[2]),this.parent.scale[2]*0.5);
	
		this.position[0]=p[0];
		this.position[1]=p[1];
		this.position[2]=p[2];
	}
}

class CubeSlider extends RotatingCubeFriend {
	constructor() {
		super(...arguments);
		this.texture=new Texture.FlatColorTexture(25,25,25,32);

		this.marker=this.addChild(new InsideMarker(4,2));
		this.marker.scale=0.3;
		this.marker.texture=new Texture.FlatColorTexture(0,0,0);
		//this.marker.texture.useLighting=false;
	}

	start() {
		super.start();
		var this_=this;
		var start_event=undefined;
		var buttons=0;
		gl.canvas.addEventListener("mousedown",function(ev) { 
			if(start_event===undefined)
				start_event=ev;
		});
		gl.canvas.addEventListener("mouseup",function(ev) { 
			if(ev.buttons==0)
				start_event=undefined;
		});
		gl.canvas.addEventListener("mousemove",function(ev) { 
			if(start_event===undefined) return true;
			var hoverOver=this_.mouseInside.call(this_,start_event);
			if((ev.buttons&2)==2 && (this_.midRotation || hoverOver ) ) {
				this_.rotateEvent.call(this_,ev);
			} else 
				this_.midRotation=false;
			if((ev.buttons&1)==1 && hoverOver) {
				this_.marker.moveEvent.call(this_.marker,ev);
			}
		});
	}	
}

class GenderGame extends Game {
	constructor(canvas) {
		super(canvas);
		var this_=this;
		this.keydown={};
		this.drawDistance=600;
		this.cameraPosition=[0,0,-250];
		this.mouse={'x':0,'y':0,'buttons':0};
		this.directionalLightPosition=[0,-1,0];
		addEventListener("contextmenu", function(ev){return false;});
		addEventListener("keydown", function(ev){ this_.keydown[ev.key]=ev; });
		addEventListener("keyup"  , function(ev){ delete this_.keydown[ev.key]; });
		addEventListener("keyup"  , function(ev){ delete this_.keydown[ev.key]; });

		this.cubeA=this.addChild(new CubeSlider());
		this.cubeA.position=[-300,200,0];
		this.cubeA.scale=100;
		this.cubeA.rotation=[Math.PI/4,-Math.PI/4,0]
		this.cubeA.texture=new Texture.FlatColorTexture(255,0,0,29);

		this.cubeB=this.addChild(new CubeSlider());
		this.cubeB.position=[-300,-0,0]
		this.cubeB.scale=100;
		this.cubeB.rotation=[Math.PI/4,-Math.PI/4,0]
		this.cubeB.texture=new Texture.FlatColorTexture(0,255,0,29);

		this.cubeC=this.addChild(new CubeSlider());
		this.cubeC.texture=new Texture.FlatColorTexture(0,0,255,29);
		this.cubeC.position=[-300,-200,0]
		this.cubeC.scale=100;
		this.cubeC.rotation=[Math.PI/4,-Math.PI/4,0]

		//this.background=this.addChild(new Cube());
		//this.background.scale=[400,400,1]
		//this.background.position=[100,0,-100]
		//this.background.texture=new Texture.FlatColorTexture(75,75,75,255);
		//this.background.texture.useLighting=false;

		this.model=this.addChild(new Sphere(30,30));
		this.model.position=[100,0,0]
		this.model.texture=new Texture.FlatColorTexture(127,127,127,255);

		this.legR=this.model.addChild(new Cube());
		this.legR.scale=[0.2,1,1]
		this.legR.position=[40,-130,0]
		this.legR.texture=new Texture.FlatColorTexture(20);

		this.legL=this.model.addChild(new Cube());
		this.legL.scale=[0.2,1,1]
		this.legL.position=[-40,-130,0]
		this.legL.texture=new Texture.FlatColorTexture(20);

		this.armR=this.model.addChild(new Cube());
		this.armR.scale=[0.2,1,1]
		this.armR.position=[120,50,0]
		this.armR.rotation=[0,0,-Math.PI/3];
		this.armR.texture=new Texture.FlatColorTexture(20);

		this.armL=this.model.addChild(new Cube());
		this.armL.scale=[0.2,1,1]
		this.armL.rotation=[0,0,Math.PI/3];
		this.armL.position=[-120,50,0]
		this.armL.texture=new Texture.FlatColorTexture(20);

		this.model.scale=[200,200,4]
		console.log(this.legL.scale);
	}

	tick() {
		super.tick()

		var color_spectrum=VectorAdd(VectorMul(VectorDiv(this.cubeA.marker.position,this.cubeA.scale),[255,255,255]),[255/2,255/2,255/2])
		this.model.texture.color[0]=color_spectrum[0];
		this.model.texture.color[1]=color_spectrum[1];
		this.model.texture.color[2]=color_spectrum[2];
		this.model.texture.start()

	}
}
