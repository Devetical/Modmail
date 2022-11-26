class Command {
    constructor(props) {
        this.name = props.name.toLowerCase();
        this.description = props.description;
        this.usage = props.usage;
        this.category = props.category;
        this.aliases = props.aliases;
    } 
}

module.exports = Command;