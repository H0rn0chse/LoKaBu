from schema import Schema, Use, SchemaError, Optional

def checkSchema(conf_schema, conf):
	print(conf)
	try:
		conf_schema.validate(conf)
		return True
	except SchemaError:
		return False

settingsSchema = Schema({
	'defaultBillingAccount': Use(int),
	'defaultTyp': Use(int)
})

typSchema = Schema({
	'id': Use(int),
	'displayName': str
})

personSchema = Schema({
	'id': Use(int),
	'displayName': str
})

accountSchema = Schema({
	'id': Use(int),
	'displayName': str,
	'owner': Use(int)
})

storeSchema = Schema({
	'id': Use(int),
	'displayName': str
})

receiptSchema = Schema({
	'id': Use(int),
	'date': Use(int),
	'account': Use(int),
	'comment': Use(str),
	'store' : Use(int),
	'lines': [{
		'id': Use(int),
		'value': Use(int),
		'billing': Use(int),
		'typ': Use(int)
	}]
})
