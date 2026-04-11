const toMySQLDate = (dateStr: string): string => {
  return new Date(dateStr).toISOString().split('T')[0]
}
export default toMySQLDate;