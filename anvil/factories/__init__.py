"""factories namespace"""

def cleanupKeys(attributes):
    new_dict = {}
    for k, v in attributes.items():
        new_dict[camelCase(replaceNumber(k))] = v

    return new_dict

def replaceNumber(key):
    if '-' in key:
        key_split = key.split('-')
        if len(key_split) > 0 and key_split[0].isnumeric():
            return '-'.join([key_split[i] for i in range(1, len(key_split))])
    return key

def camelCase(key):
    new_key = ''
    next_upper = False

    for i in range(0, len(key)):
        if len([d for d in ['-', '_', ':'] if key[i] == d]) > 0:
            next_upper = True
        else:
            if next_upper:
                new_key += key[i].upper()
                next_upper = False
            else:
                new_key += key[i]

    return new_key