(function() {
  var SnappyBox, SnappyCell, SnappyCircle, SnappyConnector, SnappyDiamond, SnappyEllipse, SnappyParallelogram,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

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

  SnappyCell = (function() {
    function SnappyCell(diagram, cellX1, cellY1, options1) {
      var base;
      this.diagram = diagram;
      this.cellX = cellX1;
      this.cellY = cellY1;
      this.options = options1 != null ? options1 : {};
      if (this.constructor === SnappyCell) {
        throw new Error("Can't instantiate abstract class SnappyCell");
      }
      (base = this.options).attrs || (base.attrs = {});
      this;
    }

    SnappyCell.prototype.x = function() {
      return this.cellX * this.diagram.cellWidth;
    };

    SnappyCell.prototype.y = function() {
      return this.cellY * this.diagram.cellHeight;
    };

    SnappyCell.prototype.anchorCoords = function(anchor) {
      var xOffset, yOffset;
      xOffset = this.xOffset(anchor);
      yOffset = this.yOffset(anchor);
      switch (anchor) {
        case 'top-left':
          return {
            x: this.x() + xOffset,
            y: this.y() + yOffset
          };
        case 'top-middle':
          return {
            x: this.x() + this.diagram.cellWidth / 2,
            y: this.y() + yOffset
          };
        case 'top-right':
          return {
            x: this.x() + this.diagram.cellWidth - xOffset,
            y: this.y() + yOffset
          };
        case 'middle-left':
          return {
            x: this.x() + xOffset,
            y: this.y() + this.diagram.cellHeight / 2
          };
        case 'middle-right':
          return {
            x: this.x() + this.diagram.cellWidth - xOffset,
            y: this.y() + this.diagram.cellHeight / 2
          };
        case 'bottom-left':
          return {
            x: this.x() + xOffset,
            y: this.y() + this.diagram.cellHeight - yOffset
          };
        case 'bottom-middle':
          return {
            x: this.x() + this.diagram.cellWidth / 2,
            y: this.y() + this.diagram.cellHeight - yOffset
          };
        case 'bottom-right':
          return {
            x: this.x() + this.diagram.cellWidth - xOffset,
            y: this.y() + this.diagram.cellHeight - yOffset
          };
      }
    };

    SnappyCell.prototype.boxWidth = function() {
      return this.diagram.cellWidth - this.diagram.options.cellSpacing;
    };

    SnappyCell.prototype.boxHeight = function() {
      return this.diagram.cellHeight - this.diagram.options.cellSpacing;
    };

    SnappyCell.prototype.xOffset = function() {
      return this.diagram.options.cellSpacing / 2;
    };

    SnappyCell.prototype.yOffset = function() {
      return this.diagram.options.cellSpacing / 2;
    };

    SnappyCell.prototype.spacingOffset = function() {
      return this.diagram.options.cellSpacing / 2;
    };

    SnappyCell.prototype.cellAttrs = function(className) {
      var attrs;
      attrs = this.options.attrs;
      attrs["class"] = [this.options.attrs["class"], 'snappy-cell', className].join(' ');
      return attrs;
    };

    SnappyCell.prototype.centerPoint = function() {
      return {
        x: this.x() + this.diagram.cellWidth / 2,
        y: this.y() + this.diagram.cellHeight / 2
      };
    };

    SnappyCell.prototype.boxPoints = function() {
      var x, y;
      x = this.x() + this.diagram.options.cellSpacing / 2;
      y = this.y() + this.diagram.options.cellSpacing / 2;
      return {
        x1: x,
        y1: y,
        x2: x + this.boxWidth(),
        y2: y + this.boxHeight()
      };
    };

    SnappyCell.prototype.draw = function() {
      this.element = this.drawElement();
      if (this.options.text) {
        this.element = this.diagram.snap.g(this.element, this.drawText());
      }
      return this.element;
    };

    SnappyCell.prototype.drawElement = function() {
      throw new Error('Abstract method');
    };

    SnappyCell.prototype.drawText = function() {
      var textElement, x, y;
      x = this.x() + this.diagram.options.cellSpacing / 2;
      y = this.y();
      return textElement = this.diagram.snap.multitext(x, y, this.options.text, this.boxWidth(), this.boxHeight());
    };

    return SnappyCell;

  })();

  SnappyBox = (function(superClass) {
    extend(SnappyBox, superClass);

    function SnappyBox() {
      return SnappyBox.__super__.constructor.apply(this, arguments);
    }

    SnappyBox.prototype.drawElement = function() {
      var points;
      points = this.boxPoints();
      return this.element = this.diagram.snap.rect(points.x1, points.y1, points.x2 - points.x1, points.y2 - points.y1, this.diagram.options.boxRadius).attr(this.cellAttrs('snappy-cell-box'));
    };

    SnappyBox.prototype.xOffset = function(anchor) {
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        return this.diagram.options.boxRadius / 3 + this.spacingOffset();
      } else {
        return this.spacingOffset();
      }
    };

    SnappyBox.prototype.yOffset = function(anchor) {
      return this.xOffset(anchor);
    };

    return SnappyBox;

  })(SnappyCell);

  SnappyCircle = (function(superClass) {
    extend(SnappyCircle, superClass);

    function SnappyCircle() {
      return SnappyCircle.__super__.constructor.apply(this, arguments);
    }

    SnappyCircle.prototype.drawElement = function() {
      var centerPoint;
      centerPoint = this.centerPoint();
      return this.element = this.diagram.snap.circle(centerPoint.x, centerPoint.y, this.radius()).attr(this.cellAttrs('snappy-cell-circle'));
    };

    SnappyCircle.prototype.xOffset = function(anchor) {
      var offset;
      offset = this.spacingOffset();
      if (this.diagram.cellWidth > this.diagram.cellHeight && ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].indexOf(anchor) >= 0) {
        offset += (this.diagram.cellWidth - this.diagram.cellHeight) / 2;
      }
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        offset += this.radius() * 0.2626;
      }
      if (offset != null) {
        return offset;
      } else {
        return this.spacingOffset();
      }
    };

    SnappyCircle.prototype.yOffset = function(anchor) {
      var offset;
      offset = this.spacingOffset();
      if (this.diagram.cellHeight > this.diagram.cellWidth && ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].indexOf(anchor) >= 0) {
        offset += (this.diagram.cellHeight - this.diagram.cellWidth) / 2;
      }
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        offset += this.radius() * 0.2626;
      }
      if (offset != null) {
        return offset;
      } else {
        return this.spacingOffset();
      }
    };

    SnappyCircle.prototype.radius = function() {
      return (Math.min(this.diagram.cellWidth, this.diagram.cellHeight) - this.diagram.options.cellSpacing) / 2;
    };

    return SnappyCircle;

  })(SnappyCell);

  SnappyDiamond = (function(superClass) {
    extend(SnappyDiamond, superClass);

    function SnappyDiamond() {
      return SnappyDiamond.__super__.constructor.apply(this, arguments);
    }

    SnappyDiamond.prototype.drawElement = function() {
      var centerPoint, points, polygon;
      centerPoint = this.centerPoint();
      points = this.boxPoints();
      polygon = [centerPoint.x, points.y1, points.x2, centerPoint.y, centerPoint.x, points.y2, points.x1, centerPoint.y, centerPoint.x, points.y1];
      return this.element = this.diagram.snap.polyline(polygon).attr(this.cellAttrs('snappy-cell-diamond'));
    };

    SnappyDiamond.prototype.offset = function(anchor, axisBoxLength) {
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        return this.spacingOffset() + axisBoxLength * 0.25;
      } else {
        return this.spacingOffset();
      }
    };

    SnappyDiamond.prototype.xOffset = function(anchor) {
      return this.offset(anchor, this.boxWidth());
    };

    SnappyDiamond.prototype.yOffset = function(anchor) {
      return this.offset(anchor, this.boxHeight());
    };

    return SnappyDiamond;

  })(SnappyCell);

  SnappyEllipse = (function(superClass) {
    extend(SnappyEllipse, superClass);

    function SnappyEllipse() {
      return SnappyEllipse.__super__.constructor.apply(this, arguments);
    }

    SnappyEllipse.prototype.drawElement = function() {
      var centerPoint, xRadius, yRadius;
      centerPoint = this.centerPoint();
      xRadius = (this.diagram.cellWidth - this.diagram.options.cellSpacing) / 2;
      yRadius = (this.diagram.cellHeight - this.diagram.options.cellSpacing) / 2;
      return this.element = this.diagram.snap.ellipse(centerPoint.x, centerPoint.y, xRadius, yRadius).attr(this.cellAttrs('snappy-cell-ellipse'));
    };

    SnappyEllipse.prototype.xOffset = function(anchor) {
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        return this.spacingOffset() + this.diagram.cellWidth * 0.1313;
      } else {
        return this.spacingOffset();
      }
    };

    SnappyEllipse.prototype.yOffset = function(anchor) {
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        return this.spacingOffset() + this.diagram.cellHeight * 0.1313;
      } else {
        return this.spacingOffset();
      }
    };

    return SnappyEllipse;

  })(SnappyCell);

  SnappyParallelogram = (function(superClass) {
    extend(SnappyParallelogram, superClass);

    function SnappyParallelogram() {
      return SnappyParallelogram.__super__.constructor.apply(this, arguments);
    }

    SnappyParallelogram.prototype.drawElement = function() {
      var offset, points, polygon;
      offset = this.offset();
      points = this.boxPoints();
      polygon = [points.x1 + offset, points.y1, points.x2, points.y1, points.x2 - offset, points.y2, points.x1, points.y2, points.x1 + offset, points.y1];
      return this.element = this.diagram.snap.polyline(polygon).attr(this.cellAttrs('snappy-cell-parallelogram'));
    };

    SnappyParallelogram.prototype.offset = function() {
      return this.diagram.cellWidth / 10;
    };

    SnappyParallelogram.prototype.xOffset = function(anchor) {
      if (['top-left', 'bottom-right'].indexOf(anchor) >= 0) {
        return this.offset() + this.spacingOffset();
      } else if (['middle-left', 'middle-right'].indexOf(anchor) >= 0) {
        return this.offset() / 2 + this.spacingOffset();
      } else {
        return this.spacingOffset();
      }
    };

    return SnappyParallelogram;

  })(SnappyCell);

  SnappyConnector = (function() {
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

    SnappyDiagram.prototype.addBox = function(cellX, cellY, options) {
      if (options == null) {
        options = {};
      }
      return this.addCell(SnappyBox, cellX, cellY, options);
    };

    SnappyDiagram.prototype.addParallelogram = function(cellX, cellY, options) {
      if (options == null) {
        options = {};
      }
      return this.addCell(SnappyParallelogram, cellX, cellY, options);
    };

    SnappyDiagram.prototype.addDiamond = function(cellX, cellY, options) {
      if (options == null) {
        options = {};
      }
      return this.addCell(SnappyDiamond, cellX, cellY, options);
    };

    SnappyDiagram.prototype.addCircle = function(cellX, cellY, options) {
      if (options == null) {
        options = {};
      }
      return this.addCell(SnappyCircle, cellX, cellY, options);
    };

    SnappyDiagram.prototype.addEllipse = function(cellX, cellY, options) {
      if (options == null) {
        options = {};
      }
      return this.addCell(SnappyEllipse, cellX, cellY, options);
    };

    SnappyDiagram.prototype.addCell = function(cellClass, cellX, cellY, options) {
      var cell;
      if (options == null) {
        options = {};
      }
      this.cellCount = Math.max(cellX + 1, this.cellCount);
      this.rowCount = Math.max(cellY + 1, this.rowCount);
      if (this.cells[cellX] == null) {
        this.cells[cellX] = [];
      }
      cell = new cellClass(this, cellX, cellY, options);
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

    SnappyDiagram.prototype.draw = function() {
      this.setDimensions();
      this.drawCells();
      return this.drawConnectors();
    };

    SnappyDiagram.prototype.setDimensions = function() {
      this.cellWidth = this.options.width / this.cellCount;
      return this.cellHeight = this.options.height / this.rowCount;
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

    SnappyDiagram.prototype["export"] = function() {
      var canvas, element, j, k, len, len1, len2, m, ref, ref1, ref2, rule, stylesheet, svg, svgImage;
      svg = this.snap.node.cloneNode(true);
      ref = document.styleSheets;
      for (j = 0, len = ref.length; j < len; j++) {
        stylesheet = ref[j];
        ref1 = stylesheet.cssRules || stylesheet.rules || [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          rule = ref1[k];
          ref2 = svg.querySelectorAll(rule.selectorText);
          for (m = 0, len2 = ref2.length; m < len2; m++) {
            element = ref2[m];
            element.style.cssText += rule.style.cssText;
          }
        }
      }
      canvas = document.createElement('canvas');
      svgImage = new Image();
      svgImage.src = "data:image/svg+xml;base64," + (btoa(svg.outerHTML));
      return svgImage.onload = function() {
        var link;
        canvas.width = svgImage.width;
        canvas.height = svgImage.height;
        canvas.getContext('2d').drawImage(svgImage, 0, 0);
        link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'snappy-diagram.png';
        return link.click();
      };
    };

    return SnappyDiagram;

  })();

}).call(this);
