# Data Security Policy

The data to be encrypted/decrypted is to be configured in terms of Attributes.

Attribute is defined as follows :
```
class Attribute {
    String jsonPath;
    String type;                //Used during encryption
    String maskingTechnique;    //Used during decryption
}
```

The enc/dec will be performed on JSON objects. The primary identifier of the Attribute is its jsonPath. 

## Guidelines for Encryption Policy

```
class EncryptionPolicy {
    String key;
    List<Attribute> attrbutes;
}
```

EncryptionPolicy file contains the configuration of attributes to encrypted. It is a list of policies to be used in different scenarios. Here key signifies the input object structure. For a given key all the attributes specified will get encrypted. The returned JSON object will contain encrypted values at the jsonPaths specified in the attributes.

The "type" property of the Attribute class is the type of data. Based on this property enc-service will decide the encryption technique to be used (Asymettric/Symmetric).


## Guideline for Decryption Access Control

Each attribute will have AccessType associated with it. 
```
class AttributeAccess {
    Attrbute attribute;
    AccessType accessType;
}
```
List of possible values for AccessType listed according to its priority is as follows: 
1. PLAIN - Decrypt the attribute and show the data in plain form. 
2. MASK - Decrypt the attribute then mask the data according to the maskingTechnique specified in the Attrbute object. 
3. NONE - Replace the data with an empty string.

Each role will have this list AttributeAccess :
```
class RoleAttributeAccess {
    String roleCode;
    List<AttributeAccess> attributeAccessList;
}
```

Decryption will happen by Attribute based Access Control(ABAC). The configuration for decryption is defined in the DecryptionABAC. It is a list of ABAC policies to used in different scenarios. Key signifies the input object structure. For each key there will be a list of RoleAttributeAccess.

