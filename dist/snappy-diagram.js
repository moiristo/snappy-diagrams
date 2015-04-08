(function() {
  this.SnappyDiagram = (function() {
    SnappyDiagram.prototype.cells = [];

    SnappyDiagram.prototype.arrows = [];

    SnappyDiagram.prototype.cellCount = 0;

    SnappyDiagram.prototype.rowCount = 0;

    function SnappyDiagram(options1) {
      var arrowPathString, defaults, key, value;
      this.options = options1 != null ? options1 : {};
      console.log('******************************************************************');
      defaults = {
        width: 1000,
        height: 500,
        cellSpacing: 10,
        boxRadius: 5
      };
      for (key in defaults) {
        value = defaults[key];
        if (this.options[key] == null) {
          this.options[key] = value;
        }
      }
      this.snap = Snap(this.options.width, this.options.height).attr({
        "class": 'snappy-diagram'
      });
      arrowPathString = "M 0 2 L 10 5 L 0 8 z";
      this.markerStart = this.snap.path(arrowPathString).transform('r180').marker(0, 0, 10, 10, 1, 5);
      this.markerEnd = this.snap.path(arrowPathString).marker(0, 0, 10, 10, 9, 5);
    }

    SnappyDiagram.prototype.addCell = function(cellX, cellY, attrs) {
      var cell;
      this.cellCount = Math.max(cellX + 1, this.cellCount);
      this.rowCount = Math.max(cellY + 1, this.rowCount);
      if (this.cells[cellX] == null) {
        this.cells[cellX] = [];
      }
      cell = new SnappyCell(this, cellX, cellY);
      this.cells[cellX].push(cell);
      return cell;
    };

    SnappyDiagram.prototype.addArrow = function(cellStart, cellEnd, options) {
      var arrow;
      if (options == null) {
        options = {};
      }
      arrow = new SnappyArrow(this, cellStart, cellEnd, options);
      this.arrows.push(arrow);
      return arrow;
    };

    SnappyDiagram.prototype.setDimensions = function() {
      this.cellWidth = this.options.width / this.cellCount;
      return this.cellHeight = this.options.height / this.rowCount;
    };

    SnappyDiagram.prototype.draw = function() {
      this.setDimensions();
      this.drawCells();
      this.drawArrows();
      return console.log('<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>');
    };

    SnappyDiagram.prototype.drawCells = function() {
      var cell, i, len, ref, results, row;
      this.setDimensions();
      ref = this.cells;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        row = ref[i];
        if (row != null) {
          results.push((function() {
            var j, len1, results1;
            results1 = [];
            for (j = 0, len1 = row.length; j < len1; j++) {
              cell = row[j];
              results1.push(cell.draw());
            }
            return results1;
          })());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    SnappyDiagram.prototype.drawArrows = function() {
      var arrow, i, len, ref, results;
      this.setDimensions();
      ref = this.arrows;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        arrow = ref[i];
        results.push(arrow.draw());
      }
      return results;
    };

    return SnappyDiagram;

  })();

  this.SnappyCell = (function() {
    SnappyCell.prototype.shape = 'box';

    function SnappyCell(diagram, cellX1, cellY1, attrs1) {
      this.diagram = diagram;
      this.cellX = cellX1;
      this.cellY = cellY1;
      this.attrs = attrs1 != null ? attrs1 : {};
      this;
    }

    SnappyCell.prototype.x = function() {
      return this.cellX * this.diagram.cellWidth;
    };

    SnappyCell.prototype.y = function() {
      return this.cellY * this.diagram.cellHeight;
    };

    SnappyCell.prototype.anchorCoords = function(anchor) {
      var boxRadiusOffset, offset;
      offset = this.diagram.options.cellSpacing / 2;
      boxRadiusOffset = this.diagram.options.boxRadius / 3;
      switch (anchor) {
        case 'top-left':
          return {
            x: this.x() + offset + boxRadiusOffset,
            y: this.y() + offset + boxRadiusOffset
          };
        case 'top-middle':
          return {
            x: this.x() + this.diagram.cellWidth / 2,
            y: this.y() + offset
          };
        case 'top-right':
          return {
            x: this.x() + this.diagram.cellWidth - offset - boxRadiusOffset,
            y: this.y() + offset + boxRadiusOffset
          };
        case 'middle-left':
          return {
            x: this.x() + offset,
            y: this.y() + this.diagram.cellHeight / 2
          };
        case 'middle-right':
          return {
            x: this.x() + this.diagram.cellWidth - offset,
            y: this.y() + (this.diagram.cellHeight / 2)
          };
        case 'bottom-left':
          return {
            x: this.x() + offset + boxRadiusOffset,
            y: this.y() + this.diagram.cellHeight - offset - boxRadiusOffset
          };
        case 'bottom-middle':
          return {
            x: this.x() + (this.diagram.cellWidth / 2),
            y: this.y() + this.diagram.cellHeight - offset
          };
        case 'bottom-right':
          return {
            x: this.x() + this.diagram.cellWidth - offset - boxRadiusOffset,
            y: this.y() + this.diagram.cellHeight - offset - boxRadiusOffset
          };
        default:
          return {
            x: this.x() + (this.diagram.cellWidth / 2),
            y: this.y() + (this.diagram.cellHeight / 2)
          };
      }
    };

    SnappyCell.prototype.draw = function() {
      switch (this.shape) {
        case 'circle':
          return this.drawCircle();
        default:
          return this.drawBox();
      }
    };

    SnappyCell.prototype.drawBox = function() {
      var height, width, x, y;
      x = this.x() + this.diagram.options.cellSpacing / 2;
      y = this.y() + this.diagram.options.cellSpacing / 2;
      width = this.diagram.cellWidth - this.diagram.options.cellSpacing;
      height = this.diagram.cellHeight - this.diagram.options.cellSpacing;
      console.log(this.attrs);
      this.attrs["class"] = [this.attrs["class"], 'snappy-cell-box'].join(' ');
      console.log(this.attrs);
      console.log('----------------------------------------');
      return this.element = this.diagram.snap.rect(x, y, width, height, this.diagram.options.boxRadius).attr(this.attrs);
    };

    SnappyCell.prototype.drawCircle = function() {
      if (this.attrs["class"] == null) {
        this.attrs["class"] = 'snappy-cell-circle';
      }
      return this.element = this.diagram.snap.circle(cellPoint.x + (cellWidth / 2), cellPoint.y + (cellHeight / 2), radius);
    };

    return SnappyCell;

  })();

  this.SnappyArrow = (function() {
    function SnappyArrow(diagram, cellStart1, cellEnd1, options1) {
      this.diagram = diagram;
      this.cellStart = cellStart1;
      this.cellEnd = cellEnd1;
      this.options = options1 != null ? options1 : {};
      this;
    }

    SnappyArrow.prototype.horizontalLabel = function(diff) {
      if (diff > 0) {
        return 'left';
      } else if (diff < 0) {
        return 'right';
      } else {
        return 'middle';
      }
    };

    SnappyArrow.prototype.verticalLabel = function(diff) {
      if (diff > 0) {
        return 'top';
      } else if (diff < 0) {
        return 'bottom';
      } else {
        return 'middle';
      }
    };

    SnappyArrow.prototype.draw = function() {
      var attrs, endAnchor, endLabel, line, startAnchor, startLabel;
      startLabel = this.options.startAnchor || [this.verticalLabel(this.cellStart.y() - this.cellEnd.y()), this.horizontalLabel(this.cellStart.x() - this.cellEnd.x())].join('-');
      endLabel = this.options.endAnchor || [this.verticalLabel(this.cellEnd.y() - this.cellStart.y()), this.horizontalLabel(this.cellEnd.x() - this.cellStart.x())].join('-');
      startAnchor = this.cellStart.anchorCoords(startLabel);
      endAnchor = this.cellEnd.anchorCoords(endLabel);
      attrs = {
        markerEnd: this.diagram.markerEnd
      };
      if (this.options.style === 'double') {
        attrs.markerStart = this.diagram.markerStart;
      }
      attrs["class"] = 'snappy-arrow';
      return line = this.diagram.snap.line(startAnchor.x, startAnchor.y, endAnchor.x, endAnchor.y).attr(attrs);
    };

    return SnappyArrow;

  })();

}).call(this);
