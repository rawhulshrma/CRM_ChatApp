class APIfeature {
    constructor(baseQuery, queryString) {
      this.baseQuery = baseQuery;
      this.queryString = queryString;
      this.query = baseQuery;
      this.params = [];
      this.paramIndex = 1;
    }
  
    search() {
      if (this.queryString.keyword) {
        this.query += ` WHERE name ILIKE $${this.paramIndex}`;
        this.params.push(`%${this.queryString.keyword}%`);
        this.paramIndex++;
      }
      return this;
    }
  
    filter() {
      const queryCopy = { ...this.queryString };
      const removeFields = ['keyword', 'limit', 'page'];
      removeFields.forEach(el => delete queryCopy[el]);
  
      let filterQuery = '';
      Object.keys(queryCopy).forEach(key => {
        if (typeof queryCopy[key] === 'object') {
          Object.keys(queryCopy[key]).forEach(operator => {
            const sqlOperator = this.getSqlOperator(operator);
            filterQuery += filterQuery ? ' AND ' : (this.queryString.keyword ? ' AND ' : ' WHERE ');
            filterQuery += `${key} ${sqlOperator} $${this.paramIndex}`;
            this.params.push(queryCopy[key][operator]);
            this.paramIndex++;
          });
        } else {
          filterQuery += filterQuery ? ' AND ' : (this.queryString.keyword ? ' AND ' : ' WHERE ');
          filterQuery += `${key} = $${this.paramIndex}`;
          this.params.push(queryCopy[key]);
          this.paramIndex++;
        }
      });
  
      this.query += filterQuery;
      return this;
    }
  
    pagination(resPerPage) {
      const page = parseInt(this.queryString.page) || 1;
      const limit = resPerPage;
      const offset = (page - 1) * limit;
  
      this.query += ` LIMIT $${this.paramIndex} OFFSET $${this.paramIndex + 1}`;
      this.params.push(limit, offset);
      this.paramIndex += 2;
  
      return this;
    }
  
    getSqlOperator(operator) {
      switch (operator) {
        case 'gt': return '>';
        case 'gte': return '>=';
        case 'lt': return '<';
        case 'lte': return '<=';
        default: return '=';
      }
    }
  
    getQuery() {
      return { text: this.query, values: this.params };
    }
  }
  
  module.exports = APIfeature;