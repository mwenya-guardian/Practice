// Copyright 2012 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var loadTimeData;
class LoadTimeData{
  constructor(){
    this.data_=null
  }
  set data(value){
    expect(!this.data_,"Re-setting data.");
    this.data_=value
  }
  valueExists(id){
    return id in this.data_
  }
  getValue(id){
    expect(this.data_,"No data. Did you remember to include strings.js?");
      const value=this.data_[id];
      expect(typeof value!=="undefined","Could not find value for "+id);
      return value
  }
  getString(id){
    const value=this.getValue(id);
    expectIsType(id,value,"string");
    return value
  }
  getStringF(id,var_args){
    const value=this.getString(id);
    if(!value){return""}
    const args=Array.prototype.slice.call(arguments);
    args[0]=value;
    return this.substituteString.apply(this,args)
  }
  substituteString(label,var_args){
    const varArgs=arguments;
    return label.replace(/\$(.|$|\n)/g,(function(m){
      expect(m.match(/\$[$1-9]/),"Unescaped $ found in localized string.");
      return m==="$$"?"$":varArgs[m[1]]}))
  }
  getBoolean(id){
    const value=this.getValue(id);
    expectIsType(id,value,"boolean");
    return value
  }
  getInteger(id){
    const value=this.getValue(id);
    expectIsType(id,value,"number");
    expect(value===Math.floor(value),"Number isn't integer: "+value);
    return value
  }
  overrideValues(replacements){
    expect(typeof replacements==="object","Replacements must be a dictionary object.");
    for(const key in replacements){
      this.data_[key]=replacements[key]
    }
  }
}
  function expect(condition,message){
    if(!condition){
      throw new Error("Unexpected condition on "+document.location.href+": "+message)
    }
  }
  function expectIsType(id,value,type){
    expect(typeof value===type,"["+value+"] ("+id+") is not a "+type)
  }
  expect(!loadTimeData,"should only include this file once");
  loadTimeData=new LoadTimeData;
  window.loadTimeData=loadTimeData;
  console.warn("crbug/1173575, non-JS module files deprecated.");