import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import * as GeometryUtils from 'three/examples/jsm/utils/GeometryUtils.js';
export class TwoPointsLineFactory {
	private material:LineMaterial;
	
	constructor(private color:number,private width:number=0.05) {
		this.material = new LineMaterial( {
			color: this.color,
			linewidth: width, // in world units with size attenuation, pixels otherwise
			worldUnits: true,
			// vertexColors: true,
			transparent: true,
			opacity: 0.9,
			depthTest: false,
			visible: true,
			//resolution:  // to be set by renderer, eventually

		} );
	}

	public createTwoPointLine(p1:THREE.Vector3,p2:THREE.Vector3):THREE.Object3D {
		const positions = p1.toArray().concat(p2.toArray());

		const geometry = new LineGeometry();
		geometry.setPositions(positions);

		const lineObject = new Line2(geometry, this.material);
		lineObject.frustumCulled = true;
		lineObject.computeLineDistances();
		lineObject.scale.set(1,1,1);
		return lineObject;
	}
}
