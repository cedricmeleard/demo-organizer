function Models(mongoose) {
    //item { id, source, text, description, users linked, transformed text }
    const itemSchema = mongoose.Schema({
        source: String,
        text: String,
        description: String,
        position: Number,
        affected: [],
        markdown: String,
        sprint: String
    });

    //sprint { id, name }
    const sprintSchema = mongoose.Schema({
        name: String
    });


    return {
        Sprint: mongoose.model('sprint', sprintSchema),
        Item: mongoose.model('item', itemSchema)
    };
}

module.exports = Models;