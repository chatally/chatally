import { readJsonOrYamlFile } from './read-json-or-yaml.js'

describe('readJsonOrYaml', function () {
  it('fails with file not found', function () {
    expect(() => {
      readJsonOrYamlFile('foo')
    }).toThrow(
      "Error reading file: ENOENT: no such file or directory, open 'foo'"
    )
  })
  it('reads JSON', function () {
    expect(readJsonOrYamlFile('testing/correct.json')).toStrictEqual({
      foo: 'bar'
    })
  })
  it('reads YAML', function () {
    expect(readJsonOrYamlFile('testing/correct.yml')).toStrictEqual({
      foo: 'bar'
    })
  })
  it('reads YAML without suffix', function () {
    expect(readJsonOrYamlFile('testing/correct-yaml')).toStrictEqual({
      foo: 'bar'
    })
  })
  it('fails to parse a props file', function () {
    expect(() => {
      readJsonOrYamlFile('testing/props.txt')
    }).toThrow('Error reading file: Failed to parse file as JSON or YAML')
  })
})
