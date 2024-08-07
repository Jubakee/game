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
    () => createItem('Sandra\'s Helmet', './items/head1.png', 'Stylish helmet offering great protection in battle.', 'COMMON', 'Equipment', 'Head',1,10),
];

const uncommonItemPool = [
    () => createItem('Sandra\'s Sweater', './items/top1.png', 'Cozy sweater for warmth and style.', 'UNCOMMON', 'Equipment', 'Top',1,15),
];

const rareItemPool = [
    () => createItem('Sandra\'s Pants', './items/bottom1.png', 'Comfortable pants for everyday wear.', 'RARE', 'Equipment', 'Bottom',1,20),
    () => createItem('Sandra\'s Gloves', './items/hands1.png', 'Stylish gloves for warmth and grip.', 'RARE', 'Equipment', 'Hands',1,20),
];

const epicItemPool = [
    () => createItem('Sandra\'s Shoes', './items/feet1.png', 'Comfortable shoes for everyday wear.', 'EPIC', 'Equipment', 'Feet',1,50),
];
