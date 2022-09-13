import Tile from './Tile'


export default function Map(scene) {

    let MappingData;
    let genesis = true;
    this.scene = scene



    this.createMap = function (mapOriginX,mapOriginY) {
        console.log(MappingData)
        let mapHorizontalLength = MappingData.length;
        let mapVerticalLength = MappingData[0].length;
        for (let vi = 0; vi < mapVerticalLength; vi++) {
            for (let hi = 0; hi < mapHorizontalLength; hi++) {
                const TileProperties = {
                    ...MappingData[vi][hi]
                }
                const tile = new Tile(this.scene)
                tile.createTile(TileProperties)                
            }
        }
    }

    Object.defineProperty(this,'MappingData', {
        get: function() {
            return MappingData
        },
        set: function(value) {
            MappingData = value;
        }
    })

}