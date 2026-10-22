import test from 'node:test';
import assert from 'node:assert/strict';
import * as library from 'libphonenumber-js/max';
import {formatPhoneInput,normalizePhone} from '../public/inquiry-state.js';

const format=(value,country,options)=>formatPhoneInput(value,country,library,options);
test('national input follows the selected numbering plan while typing',()=>{
 for(const [country,raw,expected] of [['BR','11987654321','(11) 98765-4321'],['US','2025550123','(202) 555-0123'],['PT','912345678','912 345 678'],['ES','612345678','612 34 56 78'],['GB','02079460018','020 7946 0018']]){
  assert.deepEqual(format(raw,country),{value:expected,country});
  assert.equal(normalizePhone(expected,country,library.parsePhoneNumberFromString),library.parsePhoneNumberFromString(raw,country).number);
 }
 assert.deepEqual(format('2025','US'),{value:'(202) 5',country:'US'});
 assert.deepEqual(format('','BR'),{value:'',country:'BR'});
});
test('supported international paste chooses its country and removes the duplicated calling code',()=>{
 for(const [raw,country,expected] of [['+5511987654321','BR','(11) 98765-4321'],['+12025550123','US','(202) 555-0123'],['+34612345678','ES','612 34 56 78'],['+351912345678','PT','912 345 678'],['+442079460018','GB','020 7946 0018']])assert.deepEqual(format(raw,'BR'),{value:expected,country});
 assert.equal(format('2025550123','BR').country,'BR');
 assert.equal(format('+12025550123','BR',{countryChanged:true}).country,'BR');
});
test('unsupported destinations and invalid text remain visible and cannot bypass the country policy',()=>{
 for(const raw of ['+33 6 12 34 56 78','2025550123 ext. 5','Ligue 2025550123'])assert.deepEqual(format(raw,'BR'),{value:raw,country:'BR'});
 for(const [country,raw] of [['FR','0612345678'],['BR','+33612345678'],['US','+34612345678'],['','+12025550123']])assert.throws(()=>normalizePhone(raw,country,library.parsePhoneNumberFromString),/phone/);
});
