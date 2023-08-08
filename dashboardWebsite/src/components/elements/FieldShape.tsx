import { useEffect, useRef } from 'react'
import { SECTOR_SIZE } from '../../architecture/architecture'; 

function createMap(imgData : ImageData, mapi : any, factor : any) {

    var arrayIndexY = 0;
    var arrayIndexX = 0;

    var i;
    var test;

    var three = [255, 40, 40, 255];
    var two = [255, 95, 95, 255];
    var one = [255, 182, 182, 255];
    var base = [118, 151, 118, 255];
    var none = [255, 255, 255, 0];
    var select = [0, 0, 0, 0];

    var factIndex = 1;

    imgData.data.fill(10)

    for (i = 0; imgData != null && i < imgData.data.length && factor > 0; ) {
    
        if (arrayIndexX === mapi[arrayIndexY].length && i !== 0) {
            if (factIndex === factor) {
                arrayIndexY += 1;
                factIndex = 1;
            } else {
                factIndex += 1;
            }
            arrayIndexX = 0;
        }
        test = -1;
        if (arrayIndexY < mapi.length && arrayIndexX < mapi[arrayIndexY].length) {
            test = mapi[arrayIndexY][arrayIndexX];
        }

        if (test <= -1) {
            select = none;
        }
        else if (test == 0) {
            select = base;
        }
        else if (test > 0 && test <= 5) {
            select = one;
        }
        else if (test > 5 && test <= 10) {
            select = two;
        } else {
            select = three;
        }

        for (var f = 0; f < factor; f++) {
            for (var x = 0; x < 4; x++) {
                imgData.data[i] =  select[x];
                i += 1;
            }
        }
        if (i % 4 === 0 && i !== 0) {
            arrayIndexX += 1;
        }
    }
}

function getMaxSize(mapi: any) {
    if (mapi === null || mapi.lenght() === 0)
        return (0);
    let size = mapi[0].lenght();
    mapi.forEach((elem: any) => {
        let test = elem.length();
        if (test > size) {
            size = test;
        }
    });
    return (size);
}

/**
 * Graphique de forme du champ
 * @function FieldShape
 * @category Composant / elements
 * @param props.shapeInfo {FieldShape} objet de forme du champ (pas le composant)
 * @param props.datura {DaturaPositions} position du datura
 */
export default function FieldShape(props: any) {
    require('./FieldShape.css')
    const ref = useRef<HTMLCanvasElement>(null)

    function picIndexToPtCoord(index: number, length_x: number) {
        let ptIndex = Math.floor(index / 4);
        let ptCoords: {x: number, y: number} = {x: 0, y: 0};
        ptCoords.x = ptIndex % length_x; 
        ptCoords.y = Math.floor(ptIndex / length_x);
        return ptCoords;
    }

    function ptCoordToSectorCoord(ptCoords: {x: number, y: number}) {
        let sectorCoords: {x: number, y: number} = {x: 0, y: 0};
        sectorCoords.x = Math.floor(ptCoords.x / SECTOR_SIZE);
        sectorCoords.y = Math.floor(ptCoords.y / SECTOR_SIZE);
        return sectorCoords;
    }

    useEffect(() => {
        
        var shape = props.shapeInfo.shape;
        var max_x = props.shapeInfo.max_x;
        var max_y = props.shapeInfo.max_y;
        let area = props.datura;
        
        /* console.log('shape', shape)
        console.log("area", area)
        console.log(max_x, max_y) */

        // Big rectangle 15:
        /* area = [
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        ]; */

        /* area = [
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        ];
        shape = [
            [ 0, 0, 0 ],
            [ 0, 0, 190 ],
            [ 330, 0, 190 ],
            [ 330, 0, 0 ],
        ];
        max_x = 330;
        max_y = 190;  */

        // Big rectangle 20:
        /* area = [
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        ]; */

        // Smaller rectangle (works):
        /* shape = [
            [ 0, 0, 0 ],
            [ 0, 0, 120 ],
            [ 150, 0, 120 ],
            [ 150, 0, 0 ],
        ];
        area = [
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        ];
        max_x = 150;
        max_y = 120; */

        // Triangle:
        /* shape = [
            [ 0, 0, 0 ],
            [ 0, 0, 190 ],
            [ 200, 0, 0 ],
        ];
        area = [
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        ];
        max_x = 200;
        max_y = 190; */

        if (ref.current && shape) {
            //ref.current.width += 0;

            //ref.current.setAttribute('width', '250');
            //ref.current.setAttribute('length', '200');

            var ctx = ref.current.getContext('2d', { willReadFrequently: true })

            if (!ctx)
                return

            ctx.clearRect(0, 0, 201, 201);
            ctx.beginPath();
            ctx.moveTo(shape[0][0], shape[0][2]);
            for (var i = 0; i < shape.length; i++) {
                ctx.lineTo(shape[i][0], shape[i][2]);
            }
            ctx.fill();
            ctx.closePath();
            
            var imgData = ctx.getImageData(0, 0, max_x + 1, max_y + 1)
            ctx.clearRect(0, 0, max_x + 1, max_y + 1);

            // L'affichage s'arrête à environ y=135 et x=300
            for (var i = 0; imgData?.data.length && i < imgData?.data.length; i+=4) {
                let ptCoords: {x: number, y: number} = picIndexToPtCoord(i, max_x + 1);
                let sectorCoords: {x: number, y: number} = ptCoordToSectorCoord(ptCoords);
                
                if (imgData.data[i+3] > 80) {
                    if (area && area[sectorCoords.y] && area[sectorCoords.y][sectorCoords.x] != 0) {
                        if (area[sectorCoords.y][sectorCoords.x] > 0 && area[sectorCoords.y][sectorCoords.x] <= 5) {
                            imgData.data[0 + i] = 255;
                            imgData.data[1 + i] = 182;
                            imgData.data[2 + i] = 182;
                            imgData.data[3 + i] = 255;
                        } else if (area[sectorCoords.y][sectorCoords.x] > 5 && area[sectorCoords.y][sectorCoords.x] <= 10) {
                            imgData.data[0 + i] = 255;
                            imgData.data[1 + i] = 95;
                            imgData.data[2 + i] = 95;
                            imgData.data[3 + i] = 255;
                        } else if (area[sectorCoords.y][sectorCoords.x] > 10) {
                            imgData.data[0 + i] = 255;
                            imgData.data[1 + i] = 41;
                            imgData.data[2 + i] = 41;
                            imgData.data[3 + i] = 255;
                        }
                    }
                    else {
                        // VERT
                        imgData.data[0 + i] = 118;
                        imgData.data[1 + i] = 151;
                        imgData.data[2 + i] = 118;
                        imgData.data[3 + i] = 255;
                    }
            }
        }

            /* var index_map_y = 0;
            var index_map_x = 0;

            var sector_size_x = SECTOR_SIZE;
            var sector_size_y = SECTOR_SIZE;

            var index_sector_x = 0;
            var index_sector_y = 0;

            for (var i = 0; imgData?.data.length && i < imgData?.data.length; i+=4) {
                if (index_map_x > max_x) {
                    index_map_y++;
                    index_map_x = 0;
                    index_sector_x = 0;
                } else {
                    index_map_x++;
                }
                if (index_map_y >= sector_size_y * (index_sector_y + 1)) {
                    index_sector_y++;
                    //index_sector_x = 0;
                }
                if (index_map_x >= sector_size_x * (index_sector_x + 1)) {
                    index_sector_x++;
                }

                if (imgData.data[i+3] > 80) {
                    if (area != null && area[index_sector_y][index_sector_x] == 0) {
                        imgData.data[0 + i] = 118;
                        imgData.data[1 + i] = 151;
                        imgData.data[2 + i] = 118;
                        imgData.data[3 + i] = 255;
                    } else {
                        //console.log(index_sector_x, index_sector_y, index_map_x, index_map_y)
                        imgData.data[0 + i] = 255;
                        imgData.data[1 + i] = 182;
                        imgData.data[2 + i] = 182;
                        imgData.data[3 + i] = 255;
                    }
                }
                //index_map_x++;
            } */
            if (imgData)
                ctx.putImageData(imgData, 60, 0);
        }
    }, [props.shapeInfo.shape, props.datura])

    return (
        <canvas className="fieldshape-canva" ref={ref} />
    )
};