import protobuf from 'protobufjs';

const {Type, Field, MapField} = protobuf;

const StatusResponse = new Type('StatusResponse')
  .add(new MapField('system', 1, 'string', 'Status'))
  .add(new Field('server', 2, 'ServerIdentity'));

const {Type: Type$1, MapField: MapField$1} = protobuf;

const status = new Type$1('Status')
  .add(new MapField$1('field', 1, 'string', 'string'));

const {Type: Type$2, Field: Field$1} = protobuf;

const serverIdentity = new Type$2('ServerIdentity')
  .add(new Field$1('public', 1, 'bytes'))
  .add(new Field$1('id', 2, 'bytes'))
  .add(new Field$1('address', 3, 'string'))
  .add(new Field$1('description', 4, 'string'));

const {Type: Type$3, Field: Field$2} = protobuf;

const roster = new Type$3("Roster")
  .add(new Field$2('id', 1, 'bytes'))
  .add(new Field$2('list', 2, 'ServerIdentity', 'repeated'))
  .add(new Field$2('aggregate', 3, 'bytes'));

const {Type: Type$4, Field: Field$3} = protobuf;

const signatureRequest = new Type$4("SignatureRequest")
  .add(new Field$3('message', 1, 'bytes'))
  .add(new Field$3('roster', 2, 'Roster'));

const {Type: Type$5, Field: Field$4} = protobuf;

const signatureResponse = new Type$5("SignatureResponse")
  .add(new Field$4('hash', 1, 'bytes', 'required'))
  .add(new Field$4('signature', 2, 'bytes', 'required'));

const {Type: Type$6, Field: Field$5} = protobuf;

const pinRequest = new Type$6("PinRequest")
    .add(new Field$5('pin', 1, 'string'))
    .add(new Field$5('public', 2, 'bytes'));

const {Type: Type$7, Field: Field$6} = protobuf;

const storeConfig = new Type$7("StoreConfig")
    .add(new Field$6('desc', 1, 'popDesc'));

const {Type: Type$8, Field: Field$7} = protobuf;

const storeConfigReply = new Type$8("StoreConfigReply")
    .add(new Field$7('id', 1, 'bytes'));

const {Type: Type$9, Field: Field$8} = protobuf;

const finalizeRequest = new Type$9("FinalizeRequest")
    .add(new Field$8('descId', 1, 'bytes'))
    .add(new Field$8('attendees', 2, 'bytes' ));

const {Type: Type$10, Field: Field$9} = protobuf;

const finalizeResponse = new Type$10("FinalizeResponse")
    .add(new Field$9('final', 1, 'finalStatement'));

const {Type: Type$11, Field: Field$10} = protobuf;

const popDesc = new Type$11("PopDesc")
    .add(new Field$10('name', 1, 'string'))
    .add(new Field$10('dateTime', 2, 'string'))
    .add(new Field$10('location', 3, 'string'))
    .add(new Field$10('roster', 4, 'Roster'));

const {Type: Type$12, Field: Field$11} = protobuf;

const finalStatement = new Type$12("FinalStatement")
    .add(new Field$11('desc', 1, 'popDesc'))
    .add(new Field$11('attendees', 2, 'bytes'))
    .add(new Field$11('signature', 3, 'bytes'));

const {Root} = protobuf;

const root = new Root();
root.define("cothority")
    .add(status)
    .add(serverIdentity)
    .add(StatusResponse)
    .add(roster)
    .add(signatureRequest)
    .add(signatureResponse)
    .add(pinRequest)
    .add(storeConfig)
    .add(storeConfigReply)
    .add(finalizeRequest)
    .add(finalizeResponse)
    .add(popDesc)
    .add(finalStatement);

class CothorityProtobuf {
  
  constructor() {
    this.root = root;
  }
  
  /**
   * Encode a model to be transmitted over websocket
   * @param name
   * @param fields
   * @returns {*|Buffer|Uint8Array}
   */
  encodeMessage(name, fields) {
    const model = this.getModel(name);
    
    // Create the message with the model
    const msg = model.create(fields);

    // Encode the message in a BufferArray
    return model.encode(msg).finish();
  }
  
  /**
   * Decode a message coming from a websocket
   * @param name
   * @param buffer
   */
  decodeMessage(name, buffer) {
    const model = this.getModel(name);
    return model.decode(buffer);
  }
  
  /**
   * Return the protobuf loaded model
   * @param name
   * @returns {ReflectionObject|?ReflectionObject|string}
   */
  getModel(name) {
    return this.root.lookup(`cothority.${name}`);
  }
}

class CothorityMessages extends CothorityProtobuf {
  
  /**
   * Create an encoded message to make a sign request to a cothority node
   * @param message to sign stored in a Uint8Array
   * @param servers list of ServerIdentity
   * @returns {*|Buffer|Uint8Array}
   */
  createSignatureRequest(message, servers) {
    if (!(message instanceof Uint8Array)) {
      throw new Error("message must be a instance of Uint8Array");
    }
    
    const fields = {
      message,
      roster: {
        list: servers
      }
    };
    
    return this.encodeMessage('SignatureRequest', fields);
  }
  
  /**
   * Return the decoded response
   * @param response
   * @returns {*}
   */
  decodeSignatureResponse(response) {
    response = new Uint8Array(response);

    return this.decodeMessage('SignatureResponse', response);
  }
  
  /**
   * Return the decoded response
   * @param response
   * @returns {*}
   */
  decodeStatusResponse(response) {
    response = new Uint8Array(response);

    return this.decodeMessage('StatusResponse', response);
  }

    /**
     * Create an encoded message to make a PinRequest to a cothority node
     * @param pin previously generated by the conode
     * @param publicKey
     * @returns {*|Buffer|Uint8Array}
     */
  createPinRequest(pin, publicKey) {
    const fields = {
      pin: pin,
      public: publicKey
    };

    return this.encodeMessage('PinRequest', fields);
  }

    /**
     * Create an encoded message to store configuration information of a given PoP party
     * @param name
     * @param date
     * @param location
     * @param id
     * @param servers
     * @param aggregate
     * @returns {*|Buffer|Uint8Array}
     */
  createStoreConfig(name, date, location, id, servers, aggregate) {
    const fields = {
      desc: {
        name: name,
        dateTime: date,
        location: location,
        roster: {
          id: id,
          list: servers,
          aggregate: aggregate
        }
      }
    };

    return this.encodeMessage('StoreConfig', fields);
  }

    /**
     * Return the decoded response
     * @param response
     * @returns {*}
     */
  deccdeStoreConfigReply(response) {
    response = new Uint8Array(response);

    return this.decodeMessage('StoreConfigReply', response);
  }

    /**
     * Create an encoded message to finalize on the given descid-popconfig
     * @param descId
     * @param attendees
     * @returns {*|Buffer|Uint8Array}
     */
  createFinalizeRequest(descId, attendees) {
    const fields = {
      descId: descId,
      attendees: attendees
    };

    return this.encodeMessage('FinalizeRequest', fields);
  }

    /**
     * Return the decoded response
     * @param response
     * @returns {*}
     */
  decodeFinalizeResponse(response) {
      response = new Uint8Array(response);

      return this.decodeMessage('FinalizeResponse', response);
  }
}

var index = new CothorityMessages();

export default index;
