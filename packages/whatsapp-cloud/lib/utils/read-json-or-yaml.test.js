import { readJsonOrYamlFile } from './read-json-or-yaml.js'

describe('readJsonOrYaml', () => {
  it('fails with file not found', () => {
    expect(() => {
      readJsonOrYamlFile('foo')
    }).toThrow(
      'Error reading file: ENOENT: no such file or directory, open \'foo\'',
    )
  })
  it('reads JSON', () => {
    expect(readJsonOrYamlFile('testing/correct.json')).toStrictEqual({
      foo: 'bar',
    })
  })
  it('reads YAML', () => {
    expect(readJsonOrYamlFile('testing/correct.yml')).toStrictEqual({
      foo: 'bar',
    })
  })
  it('reads YAML without suffix', () => {
    expect(readJsonOrYamlFile('testing/correct-yaml')).toStrictEqual({
      foo: 'bar',
    })
  })
  it('fails to parse a props file', () => {
    expect(() => {
      readJsonOrYamlFile('testing/props.txt')
    }).toThrow('Error reading file: Failed to parse file as JSON or YAML')
  })
})
