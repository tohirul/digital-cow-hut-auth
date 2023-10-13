'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.categoryEnumValues =
  exports.labelEnumValues =
  exports.breedEnumValues =
  exports.landmarkEnumValues =
  exports.Category =
  exports.Label =
  exports.Breed =
  exports.Landmark =
    void 0;
var Landmark;
(function (Landmark) {
  Landmark['Dhaka'] = 'Dhaka';
  Landmark['Chattogram'] = 'Chattogram';
  Landmark['Barishal'] = 'Barishal';
  Landmark['Rajshahi'] = 'Rajshahi';
  Landmark['Sylhet'] = 'Sylhet';
  Landmark['Comilla'] = 'Comilla';
  Landmark['Rangpur'] = 'Rangpur';
  Landmark['Mymensingh'] = 'Mymensingh';
})(Landmark || (exports.Landmark = Landmark = {}));
var Breed;
(function (Breed) {
  Breed['Brahman'] = 'Brahman';
  Breed['Nellore'] = 'Nellore';
  Breed['Sahiwal'] = 'Sahiwal';
  Breed['Gir'] = 'Gir';
  Breed['Indigenous'] = 'Indigenous';
  Breed['Tharparkar'] = 'Tharparkar';
  Breed['Kankrej'] = 'Kankrej';
})(Breed || (exports.Breed = Breed = {}));
var Label;
(function (Label) {
  Label['ForSale'] = 'for sale';
  Label['SoldOut'] = 'sold out';
})(Label || (exports.Label = Label = {}));
var Category;
(function (Category) {
  Category['Dairy'] = 'Dairy';
  Category['Beef'] = 'Beef';
  Category['DualPurpose'] = 'Dual Purpose';
})(Category || (exports.Category = Category = {}));
exports.landmarkEnumValues = [
  'Dhaka',
  'Chattogram',
  'Barishal',
  'Rajshahi',
  'Sylhet',
  'Comilla',
  'Rangpur',
  'Mymensingh',
];
exports.breedEnumValues = [
  'Brahman',
  'Nellore',
  'Sahiwal',
  'Gir',
  'Indigenous',
  'Tharparkar',
  'Kankrej',
];
exports.labelEnumValues = ['for sale', 'sold out'];
exports.categoryEnumValues = ['Dairy', 'Beef', 'Dual Purpose'];
