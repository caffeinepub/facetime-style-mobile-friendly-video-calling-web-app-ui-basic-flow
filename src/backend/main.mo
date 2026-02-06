import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Timer "mo:core/Timer";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Nat32 "mo:core/Nat32";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Contact = {
    id : Time.Time;
    name : Text;
    handle : Text;
    createdAt : Time.Time;
  };

  public type CallSession = {
    id : Text;
    creator : Principal;
    peer : ?Peer;
    state : CallState;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type Peer = {
    principal : Principal;
    handle : Text;
    status : PeerStatus;
    joinedAt : ?Time.Time;
  };

  public type CallState = {
    #pending;
    #active;
    #end;
  };

  public type PeerStatus = {
    #called;
    #joined;
    #active;
    #hangup;
  };

  let contacts = Map.empty<Principal, Map.Map<Time.Time, Contact>>();
  let calls = Map.empty<Text, CallSession>();

  public shared ({ caller }) func createContact(name : Text, handle : Text) : async Contact {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save contacts");
    };

    let id = Time.now();
    let contact : Contact = {
      id;
      name;
      handle;
      createdAt = Time.now();
    };

    let userContacts = switch (contacts.get(caller)) {
      case (?existing) { existing };
      case (null) { Map.empty<Time.Time, Contact>() };
    };

    userContacts.add(id, contact);
    contacts.add(caller, userContacts);

    contact;
  };

  public query ({ caller }) func listContacts() : async [Contact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view contacts");
    };

    switch (contacts.get(caller)) {
      case (?userContacts) {
        userContacts.values().toArray();
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteContact(contactId : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete contacts");
    };

    switch (contacts.get(caller)) {
      case (?userContacts) {
        if (not userContacts.containsKey(contactId)) {
          Runtime.trap("Contact not found");
        };
        userContacts.remove(contactId);
        contacts.add(caller, userContacts);
      };
      case (null) {
        Runtime.trap("No contacts found for caller");
      };
    };
  };

  public shared ({ caller }) func createCallSession() : async CallSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create call sessions");
    };

    let sessionId = Time.now().toText();

    let session : CallSession = {
      id = sessionId;
      creator = caller;
      peer = null;
      state = #pending;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    calls.add(sessionId, session);
    session;
  };

  public shared ({ caller }) func joinCallSession(sessionId : Text, handle : Text) : async CallSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join call sessions");
    };

    switch (calls.get(sessionId)) {
      case (null) { Runtime.trap("Call session not found") };
      case (?session) {
        if (session.creator == caller) {
          Runtime.trap("Creator cannot join as peer");
        };

        if (session.peer != null) { Runtime.trap("Session already has a peer") };

        let peer : Peer = {
          principal = caller;
          handle;
          status = #joined;
          joinedAt = ?Time.now();
        };

        let updatedSession : CallSession = {
          id = session.id;
          creator = session.creator;
          peer = ?peer;
          state = #active;
          createdAt = session.createdAt;
          updatedAt = Time.now();
        };

        calls.add(sessionId, updatedSession);
        updatedSession;
      };
    };
  };

  public shared ({ caller }) func endCallSession(sessionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can end call sessions");
    };

    switch (calls.get(sessionId)) {
      case (null) { Runtime.trap("Call session not found") };
      case (?session) {
        if (session.creator != caller) {
          Runtime.trap("Only the creator can end the session");
        };

        let updatedSession : CallSession = {
          id = session.id;
          creator = session.creator;
          peer = session.peer;
          state = #end;
          createdAt = session.createdAt;
          updatedAt = Time.now();
        };

        calls.add(sessionId, updatedSession);
      };
    };
  };

  public query ({ caller }) func getCallSession(sessionId : Text) : async CallSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view call sessions");
    };

    switch (calls.get(sessionId)) {
      case (null) { Runtime.trap("Call session not found") };
      case (?session) {
        // Verify caller is a participant (creator or peer)
        let isPeer = switch (session.peer) {
          case (?p) { p.principal == caller };
          case (null) { false };
        };

        if (session.creator != caller and not isPeer) {
          Runtime.trap("Unauthorized: Only session participants can view this call");
        };

        session;
      };
    };
  };

  public query ({ caller }) func getActiveCallSessions() : async [CallSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view call sessions");
    };

    let activeSessions = calls.values().toArray().filter(
      func(session) {
        session.state != #end;
      }
    );
    activeSessions;
  };
};
