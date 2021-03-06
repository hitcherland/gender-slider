class Grid extends Mesh {
	constructor(width,height,unitLength) {
		var vertices=[];
		var triangles=[];
		var normals=[];
		var textureCoords=[];

		for (var i = 0; i <= width; i++)
		{
				var x = i - width / 2;
				for (var j = 0; j <= height; j++)
				{
						var y = j - height / 2;
						vertices.push(x*unitLength[0]);
						vertices.push(y*unitLength[1]);
						vertices.push(0);
						normals.push(0);
						normals.push(0);
						normals.push(1);

						textureCoords.push(i);
						textureCoords.push(j);

						if (i < width && j < height)
						{
								triangles[6 * (i * height + j) + 0] = Math.floor((i + 0) * (height+1) + j + 0);
								triangles[6 * (i * height + j) + 1] = Math.floor((i + 0) * (height+1) + j + 1);
								triangles[6 * (i * height + j) + 2] = Math.floor((i + 1) * (height+1) + j + 0);
								triangles[6 * (i * height + j) + 3] = Math.floor((i + 0) * (height+1) + j + 1);
								triangles[6 * (i * height + j) + 4] = Math.floor((i + 1) * (height+1) + j + 1);
								triangles[6 * (i * height + j) + 5] = Math.floor((i + 1) * (height+1) + j + 0);

						}
				}
		}
		super(vertices,triangles,normals,textureCoords);
	}

	resize(width,height,unitLength) {
		var vertices=[];
		var triangles=[];
		var normals=[];

		for (var i = 0; i <= width; i++)
		{
			var x = i - width / 2;
			for (var j = 0; j <= height; j++)
			{
				var y = j - height / 2;
				vertices.push(x*unitLength[0]);
				vertices.push(y*unitLength[1]);
				vertices.push(0);
				normals.push(0);
				normals.push(0);
				normals.push(1);

				if (i < width && j < height)
				{
					triangles[6 * (i * height + j) + 0] = Math.floor((i + 0) * (height+1) + j + 0);
					triangles[6 * (i * height + j) + 1] = Math.floor((i + 0) * (height+1) + j + 1);
					triangles[6 * (i * height + j) + 2] = Math.floor((i + 1) * (height+1) + j + 0);
					triangles[6 * (i * height + j) + 3] = Math.floor((i + 0) * (height+1) + j + 1);
					triangles[6 * (i * height + j) + 4] = Math.floor((i + 1) * (height+1) + j + 1);
					triangles[6 * (i * height + j) + 5] = Math.floor((i + 1) * (height+1) + j + 0);

				}
			}
		}


		this.vertices=vertices;
		this.triangles=triangles;
		this.normals=normals;

	}
}

class Cone extends Mesh {
	constructor(subdivides,baseSize) {
		var vertices=[0,0,-0.5,0,0,0.5];
		var triangles=[];
		var normals =[0,0,-1,0,0,1];
		var textureCoords=[0,0,0,0];

		for (var i=2; i<=subdivides+1; i++) {
			var theta=i*2*Math.PI/subdivides;
	    var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);
			
			vertices.push(sinTheta*baseSize);
			vertices.push(cosTheta*baseSize);
			vertices.push(0.5);
			
			normals.push(sinTheta)
			normals.push(cosTheta)
			normals.push(0)

			textureCoords.push(sinTheta);
			textureCoords.push(cosTheta);
			
			triangles.push(0);
			triangles.push(i);
			if(i==subdivides+1) {
				triangles.push(2);
			} else {
				triangles.push(i+1)
			}

			triangles.push(i);
			if(i==subdivides+1) {
				triangles.push(2);
			} else {
				triangles.push(i+1)
			}
			triangles.push(1);
		}

		super(vertices,triangles,normals,textureCoords);
	}

}

class Sphere extends Mesh {
	constructor(longitudes,latitudes) {
		var vertices=[];
		var triangles=[];
		var normals=[];
		var textureCoords=[];

    for (var latNumber = 0; latNumber <= latitudes; latNumber++) {
      var theta = latNumber * Math.PI / latitudes;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= longitudes; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudes;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = 0.5*cosPhi * sinTheta;
        var y = 0.5*cosTheta;
        var z = 0.5*sinPhi * sinTheta;
	
        normals.push(x);
        normals.push(y);
        normals.push(z);
        vertices.push(x);
        vertices.push(y);
        vertices.push(z);

//				textureCoords.push((latNumber*1.0/(latitudes-1))*128);
//				textureCoords.push((longNumber*1.0/(longitudes-1))*128);
				textureCoords.push(64+sinPhi*64);
				textureCoords.push(64+sinTheta*64);
      }
    }

		for(var i=0; i<latitudes; i++) {
			for(var j=0; j<longitudes; j++) {
				var first = (i * (longitudes + 1)) + j;
        var second = first + (longitudes + 1);

        triangles.push(first);
        triangles.push(second);
        triangles.push(first + 1);

        triangles.push(second);
        triangles.push(second + 1);
        triangles.push(first + 1);
			}
			
		}
		super(vertices,triangles,normals,textureCoords);
	}
}

class Cube extends Mesh {
	constructor() {
		var vertices=[
			// front face
			-0.5, -0.5,   0.5,
			 0.5, -0.5,   0.5,
			 0.5,  0.5,   0.5,
			-0.5,  0.5,   0.5,

			// back face
			-0.5, -0.5,  -0.5,
			-0.5,  0.5,  -0.5,
			 0.5,  0.5,  -0.5,
			 0.5, -0.5,  -0.5,

			// top face
			-0.5,  0.5,  -0.5,
			-0.5,  0.5,   0.5,
			 0.5,  0.5,   0.5,
			 0.5,  0.5,  -0.5,

			// bottom face
			-0.5, -0.5,  -0.5,
			 0.5, -0.5,  -0.5,
			 0.5, -0.5,   0.5,
			-0.5, -0.5,   0.5,

			// right face
			 0.5, -0.5,  -0.5,
			 0.5,  0.5,  -0.5,
			 0.5,  0.5,   0.5,
			 0.5, -0.5,   0.5,

			// left face
			-0.5, -0.5,  -0.5,
			-0.5, -0.5,   0.5,
			-0.5,  0.5,   0.5,
			-0.5,  0.5,  -0.5,
		];
		var triangles=[
			0, 1, 2,      0, 2, 3, 
			4, 5, 6,      4, 6, 7, 
			8, 9, 10,     8, 10, 11,  // Top face
			12, 13, 14,   12, 14, 15, // Bottom face
			16, 17, 18,   16, 18, 19, // Right face
			20, 21, 22,   20, 22, 23  // Left face	
		];
		var normals=[
			0,0,1,
			0,0,1,
			0,0,1,
			0,0,1,
			
			0,0,-1,
			0,0,-1,
			0,0,-1,
			0,0,-1,

			0,1,0,
			0,1,0,
			0,1,0,
			0,1,0,
			
			0,-1,0,
			0,-1,0,
			0,-1,0,
			0,-1,0,

			1,0,0,
			1,0,0,
			1,0,0,
			1,0,0,
			
			-1,0,0,
			-1,0,0,
			-1,0,0,
			-1,0,0,
		];

		var textureCoords=[
			// front face
			0, 0,  
			128, 0,  
			128, 128,  
			0, 128,  

			// back face
			0, 0,  
			0, 128,  
			128, 128,  
			128, 0,  

			// top face
			0, 128,  
			0, 128,  
			128, 128,  
			128, 128,  

			// bottom face
			0, 0,  
			128, 0,  
			128, 0,  
			0, 0,  

			// right face
			128, 0,  
			128, 128,  
			128, 128,  
			128, 0,  

			// left face
			0, 0,  
			0, 0,  
			0, 128,  
			0, 128,  
		];


		super(vertices,triangles,normals,textureCoords);
	}
}


