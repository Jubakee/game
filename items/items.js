function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function createItem(name, image, description, rarity, type, slot, level, income) {
    return {
        id: generateUUID(),
        name: name,
        image: image,
        description: description,
        rarity: rarity,
        type: type,
        slot: slot,
        level: level,
        income: income
    };
}

const commonItemPool = [
    () => createItem('Head', './items/head1.png', 'Head Item', 'Common', 'Equipment', 'Head',1,10),
];

const uncommonItemPool = [
    () => createItem('Top', './items/top1.png', '+Top Item', 'Uncommon', 'Equipment', 'Top',5,15),
];

const rareItemPool = [
    () => createItem('Bottom', './items/bottom1.png', 'Bottom Icon', 'Rare', 'Equipment', 'Bottom',10,20),
    () => createItem('Hands', './items/hands1.png', 'Hands Item', 'Rare', 'Equipment', 'Hands',10,20),
];

const epicItemPool = [
    () => createItem('Feet', './items/feet1.png', 'Feet Item', 'Epic', 'Equipment', 'Feet',25,50),
];
