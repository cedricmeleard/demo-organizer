/**
 * Created by CMeleard on 12/09/2016.
 */
function Models(mongoose) {
    //item { id, source, text, description }
    var itemSchema = mongoose.Schema({
        source: String,
        text: String,
        description: String,
        position: Number,
        affected: [],
        markdown: String
    });

    return mongoose.model('item', itemSchema);
}

module.exports = Models;