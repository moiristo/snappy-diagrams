(function() {
  Snap.plugin(function(Snap, Element, Paper, glob) {
    return Paper.prototype.multitext = function(x, y, txt, maxWidth, maxHeight, attributes) {
      var abc, bbox, currentLine, i, l, letterWidth, lines, svg, t, temp, tspans, widthSoFar, words;
      svg = Snap();
      abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      temp = svg.text(0, 0, abc);
      temp.attr(attributes);
      letterWidth = temp.getBBox().width / abc.length;
      svg.remove();
      words = txt.split(' ');
      widthSoFar = 0;
      currentLine = 0;
      lines = [''];
      i = 0;
      while (i < words.length) {
        l = words[i].length;
        if (widthSoFar + l * letterWidth > maxWidth) {
          lines.push('');
          currentLine++;
          widthSoFar = 0;
        }
        widthSoFar += l * letterWidth;
        lines[currentLine] += words[i] + ' ';
        i++;
      }
      t = this.text(x, y, lines).attr(attributes);
      y = y + t.getBBox().height;
      tspans = t.selectAll('tspan:nth-child(n+2)');
      tspans.attr({
        x: x,
        dy: '1.3em'
      });
      bbox = t.getBBox();
      if (bbox.width < maxWidth) {
        x = x + (maxWidth - bbox.width) / 2;
      }
      if (bbox.height < maxHeight) {
        y = y + (maxHeight - bbox.height) / 2;
      }
      t.attr({
        x: x,
        y: y
      });
      tspans.attr({
        x: x
      });
      return t;
    };
  });

  this.SnappyDiagram = (function() {
    function SnappyDiagram(options1) {
      var defaults, key, value;
      this.options = options1 != null ? options1 : {};
      this.cellCount = 0;
      this.rowCount = 0;
      this.cells = [];
      this.connectors = [];
      defaults = {
        width: 1000,
        height: 500,
        cellSpacing: 10,
        boxRadius: 5,
        markerWidth: 7,
        markerHeight: 10
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
      this.markerEnd = this.triangleMarker(this.options.markerWidth, this.options.markerHeight);
      this.markerStart = this.triangleMarker(this.options.markerWidth, this.options.markerHeight, true);
    }

    SnappyDiagram.prototype.triangleMarker = function(width, height, reverse) {
      var connectorPathString, path;
      if (reverse == null) {
        reverse = false;
      }
      connectorPathString = "M 0 0 L " + height + " " + (width / 2) + " L 0 " + width + " z";
      path = this.snap.path(connectorPathString);
      if (reverse) {
        path = path.transform('r180');
      }
      path = path.marker(0, 0, height, width, (reverse ? 1 : height), width / 2);
      return path;
    };

    SnappyDiagram.prototype.addCell = function(cellX, cellY, options) {
      var cell;
      if (options == null) {
        options = {};
      }
      this.cellCount = Math.max(cellX + 1, this.cellCount);
      this.rowCount = Math.max(cellY + 1, this.rowCount);
      if (this.cells[cellX] == null) {
        this.cells[cellX] = [];
      }
      cell = new SnappyCell(this, cellX, cellY, options);
      this.cells[cellX].push(cell);
      return cell;
    };

    SnappyDiagram.prototype.addConnector = function(cellStart, cellEnd, options) {
      var connector;
      if (options == null) {
        options = {};
      }
      connector = new SnappyConnector(this, cellStart, cellEnd, options);
      this.connectors.push(connector);
      return connector;
    };

    SnappyDiagram.prototype.setDimensions = function() {
      this.cellWidth = this.options.width / this.cellCount;
      return this.cellHeight = this.options.height / this.rowCount;
    };

    SnappyDiagram.prototype.draw = function() {
      this.setDimensions();
      this.drawCells();
      return this.drawConnectors();
    };

    SnappyDiagram.prototype.drawCells = function() {
      var cell, j, len, ref, results, row;
      this.setDimensions();
      ref = this.cells;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        row = ref[j];
        if (row != null) {
          results.push((function() {
            var k, len1, results1;
            results1 = [];
            for (k = 0, len1 = row.length; k < len1; k++) {
              cell = row[k];
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

    SnappyDiagram.prototype.drawConnectors = function() {
      var connector, j, len, ref, results;
      this.setDimensions();
      ref = this.connectors;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        connector = ref[j];
        results.push(connector.draw());
      }
      return results;
    };

    return SnappyDiagram;

  })();

  this.SnappyCell = (function() {
    function SnappyCell(diagram, cellX1, cellY1, options1) {
      var base, base1;
      this.diagram = diagram;
      this.cellX = cellX1;
      this.cellY = cellY1;
      this.options = options1 != null ? options1 : {};
      (base = this.options).shape || (base.shape = 'box');
      (base1 = this.options).attrs || (base1.attrs = {});
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

    SnappyCell.prototype.cellAttrs = function(className) {
      var attrs;
      attrs = this.options.attrs;
      attrs["class"] = [this.options.attrs["class"], className].join(' ');
      return attrs;
    };

    SnappyCell.prototype.centerPoint = function() {
      return {
        x: this.x() + this.diagram.cellWidth / 2,
        y: this.y() + this.diagram.cellHeight / 2
      };
    };

    SnappyCell.prototype.draw = function() {
      switch (this.options.shape) {
        case 'circle':
          this.drawCircle();
          break;
        case 'ellipse':
          this.drawEllipse();
          break;
        default:
          this.drawBox();
      }
      if (this.options.text) {
        return this.element = this.diagram.snap.g(this.element, this.drawText());
      }
    };

    SnappyCell.prototype.drawBox = function() {
      var height, width, x, y;
      x = this.x() + this.diagram.options.cellSpacing / 2;
      y = this.y() + this.diagram.options.cellSpacing / 2;
      width = this.diagram.cellWidth - this.diagram.options.cellSpacing;
      height = this.diagram.cellHeight - this.diagram.options.cellSpacing;
      return this.element = this.diagram.snap.rect(x, y, width, height, this.diagram.options.boxRadius).attr(this.cellAttrs('snappy-cell-box'));
    };

    SnappyCell.prototype.drawCircle = function() {
      var centerPoint, radius;
      centerPoint = this.centerPoint();
      radius = (Math.min(this.diagram.cellWidth, this.diagram.cellHeight) - this.diagram.options.cellSpacing) / 2;
      return this.element = this.diagram.snap.circle(centerPoint.x, centerPoint.y, radius).attr(this.cellAttrs('snappy-cell-box'));
    };

    SnappyCell.prototype.drawEllipse = function() {
      var centerPoint, xRadius, yRadius;
      centerPoint = this.centerPoint();
      xRadius = (this.diagram.cellWidth - this.diagram.options.cellSpacing) / 2;
      yRadius = (this.diagram.cellHeight - this.diagram.options.cellSpacing) / 2;
      return this.element = this.diagram.snap.ellipse(centerPoint.x, centerPoint.y, xRadius, yRadius).attr(this.cellAttrs('snappy-cell-ellipse'));
    };

    SnappyCell.prototype.drawText = function() {
      var maxHeight, maxWidth, textElement, x, y;
      x = this.x() + this.diagram.options.cellSpacing / 2;
      y = this.y();
      maxWidth = this.diagram.cellWidth - this.diagram.options.cellSpacing;
      maxHeight = this.diagram.cellHeight - this.diagram.options.cellSpacing;
      return textElement = this.diagram.snap.multitext(x, y, this.options.text, maxWidth, maxHeight);
    };

    return SnappyCell;

  })();

  this.SnappyConnector = (function() {
    function SnappyConnector(diagram, cellStart1, cellEnd1, options1) {
      this.diagram = diagram;
      this.cellStart = cellStart1;
      this.cellEnd = cellEnd1;
      this.options = options1 != null ? options1 : {};
      this;
    }

    SnappyConnector.prototype.horizontalLabel = function(diff) {
      if (diff > 1) {
        return 'left';
      } else if (diff < -1) {
        return 'right';
      } else {
        return 'middle';
      }
    };

    SnappyConnector.prototype.verticalLabel = function(diff) {
      if (diff > 1) {
        return 'top';
      } else if (diff < -1) {
        return 'bottom';
      } else {
        return 'middle';
      }
    };

    SnappyConnector.prototype.draw = function() {
      var attrs, endAnchor, endLabel, line, startAnchor, startLabel;
      startLabel = this.options.startAnchor || [this.verticalLabel(this.cellStart.cellY - this.cellEnd.cellY), this.horizontalLabel(this.cellStart.cellX - this.cellEnd.cellX)].join('-');
      endLabel = this.options.endAnchor || [this.verticalLabel(this.cellEnd.cellY - this.cellStart.cellY), this.horizontalLabel(this.cellEnd.cellX - this.cellStart.cellX)].join('-');
      startAnchor = this.cellStart.anchorCoords(startLabel);
      endAnchor = this.cellEnd.anchorCoords(endLabel);
      attrs = {};
      if (this.options.style !== 'line') {
        attrs.markerEnd = this.diagram.markerEnd;
      }
      if (this.options.style === 'double') {
        attrs.markerStart = this.diagram.markerStart;
      }
      attrs["class"] = 'snappy-connector';
      return line = this.diagram.snap.line(startAnchor.x, startAnchor.y, endAnchor.x, endAnchor.y).attr(attrs);
    };

    return SnappyConnector;

  })();

}).call(this);
