package se.kth.castor.yasjf4j;




import com.beust.klaxon.JsonObject;
import com.beust.klaxon.Klaxon;
import com.beust.klaxon.Parser;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class JObjectImpl extends HashMap implements JObject {

	static Parser parser = new Parser();
	static Klaxon klaxon = new Klaxon();

	public JObjectImpl() {
	}

	public JObjectImpl(Map json) throws JException {
		for(Object key: json.keySet()) {
			Object el = json.get(key);
			if(el instanceof Map) {
				put(key, new JObjectImpl((Map) el));
			} else if (el instanceof List) {
				put(key, new JArrayImpl((List) el));
			} else {
				put(key, el);
			}
		}
	}

	public JObjectImpl(String json) throws JException {
		Map o = (JsonObject) JObjectImpl.parser.parse(new StringBuilder(json));
		for(Object key: o.keySet()) {
			Object el = o.get(key);
			if(el instanceof Map) {
				put(key, new JObjectImpl((Map) el));
			} else if (el instanceof List) {
				put(key, new JArrayImpl((List) el));
			} else {
				put(key, el);
			}
		}
	}

	@Override
	public Set<String> YASJF4J_getKeys() {
		return keySet();
	}

	@Override
	public Object YASJF4J_get(String s) throws JException {
		return get(s);
	}

	@Override
	public void YASJF4J_put(String s, Object o) throws JException {
		put(s,o);
	}

	@Override
	public void YASJF4J_remove(String s) throws JException {
		remove(s);
	}

	@Override
	public String YASJF4J_toString() {
		return klaxon.toJsonString(this);
	}
}
