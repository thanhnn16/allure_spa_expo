import {Assets, Image} from 'react-native-ui-lib';

Assets.loadAssetsGroup('icons', {
    comment: require('../icons/comment.svg'),
    heart: require('../icons/heart.svg'),
    shoppingCart: require('../icons/shopping-cart.svg'),
    sun: require('../icons/sun.svg'),
    ticket: require('../icons/ticket.svg'),
});

// or as a nested group to create your own hierarchy
// Assets.loadAssetsGroup('illustrations.placeholders', {
//     emptyCart: require('emptyCart.png'),
//     emptyProduct: require('emptyProduct.png'),
// });
// Assets.loadAssetsGroup('illustrations.emptyStates.', {
//     noMessages: require('noMessages.png'),
//     noContacts: require('noContacts.png'),
// });
