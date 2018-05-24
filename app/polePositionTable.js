const tableHeading = '<h2>Zeppelin\'s Easter eggs</h2><p><table ><tbody id="pole-position"><tr><th>Icon</th><th>Hash</th> <th>easter-egg</th></tr>'
const tableTail = '</tbody></table>'

function tableRow(icon, hash, preImage){
    let row = '<tr><td >'+icon+'</td><td >'+hash+'</td> <td >'+preImage+'</td></tr>';
    return row;
}

export {tableHeading,tableTail,tableRow}
