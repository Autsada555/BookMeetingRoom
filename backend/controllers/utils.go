package controllers

import (
	"encoding/json"
	"reflect"
)

func OmitEmpty(obj interface{}) interface{} {
	v := reflect.ValueOf(obj)
	data, _ := json.Marshal(obj)

	switch v.Kind() {
	case reflect.Struct, reflect.Map:
		var jsonMap map[string]interface{}
		json.Unmarshal(data, &jsonMap)
		return parseMap(jsonMap)
	case reflect.Array, reflect.Slice:
		var jsonArray []interface{}
		json.Unmarshal(data, &jsonArray)
		return parseSlice(jsonArray)
	case reflect.Pointer:
		return OmitEmpty(reflect.ValueOf(obj).Elem().Interface())
	default:
		return obj
	}
}
func parse(input interface{}) interface{} {
	switch value := input.(type) {
	case map[string]interface{}:
		return parseMap(value)
	case []interface{}:
		return parseSlice(value)
	default:
		return value
	}
}

func parseMap(input map[string]interface{}) map[string]interface{} {
	result := make(map[string]interface{})
	for key, value := range input {
		parsedValue := parse(value)
		if !isEmpty(parsedValue) {
			result[key] = parsedValue
		}
	}
	return result
}

func parseSlice(input []interface{}) []interface{} {
	result := make([]interface{}, 0)
	for _, value := range input {
		parsedValue := parse(value)
		if !isEmpty(parsedValue) {
			result = append(result, parsedValue)
		}
	}
	return result
}

func isEmpty(value interface{}) bool {
	v := reflect.ValueOf(value)
	switch v.Kind() {
	case reflect.Array, reflect.String:
		return v.Len() == 0
	case reflect.Bool:
		return !v.Bool()
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return v.Int() == 0
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:
		return v.Uint() == 0
	case reflect.Float32, reflect.Float64:
		return v.Float() == 0
	case reflect.Interface, reflect.Ptr:
		return v.IsNil()
	case reflect.Map, reflect.Slice:
		if v.IsNil() {
			return true
		}
		return v.Len() == 0
	default:
		return value == nil
	}
}